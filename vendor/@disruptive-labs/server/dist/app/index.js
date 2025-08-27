"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.App = void 0;
const events_1 = require("events");
const http_1 = __importDefault(require("http"));
const koa_1 = __importDefault(require("koa"));
const lodash_1 = require("lodash");
const enhancers_1 = require("./enhancers");
const log_1 = require("../log");
const router_1 = require("../router");
Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return router_1.Router; } });
const store_1 = require("../store");
class App extends events_1.EventEmitter {
    constructor(config = {}) {
        super();
        this.conf = {};
        this.setMaxListeners(100);
        this.conf = config;
        this.log = new log_1.Log(this.config('log'));
        this.app = new koa_1.default();
        this.context = this.app.context;
        this.router = new router_1.Router();
        this.redis = (0, store_1.createStore)(this.config('store'));
        this.server = http_1.default.createServer(this.app.callback());
        enhancers_1.enhancers.forEach((enhance) => {
            enhance(this);
        });
    }
    config(key, defaultValue) {
        return (0, lodash_1.get)(this.conf, key, defaultValue);
    }
    use(middleware) {
        this.app.use(middleware);
    }
    store() {
        if (!this.redis) {
            throw new Error('App store not configured!');
        }
        return this.redis;
    }
    mount(router) {
        this.router.use(router instanceof router_1.Router ? router.routes() : router);
    }
    callback() {
        return this.app.callback();
    }
    start(portOverride) {
        this.emit('starting');
        const port = portOverride || this.config('port') || 3000;
        try {
            this.server.listen(port, (err) => {
                if (err) {
                    this.log.debug('⚠️ Server failed to start!');
                    this.emit('error', err);
                    this.stop();
                }
                this.log.debug(`✅ Server listening on port ${port}!`);
                this.emit('listening', this.server);
            });
        }
        catch (err) {
            this.log.debug('⚠️ Server failed to start!');
            this.emit('error', err);
            this.stop();
        }
        return this.server;
    }
    stop(callback) {
        this.emit('stopping');
        if (this.server.listening) {
            this.server.close(() => {
                this.emit('stopped');
                callback === null || callback === void 0 ? void 0 : callback();
            });
        }
        else {
            this.emit('stopped');
            callback === null || callback === void 0 ? void 0 : callback();
        }
    }
}
exports.App = App;
App.Router = router_1.Router;
