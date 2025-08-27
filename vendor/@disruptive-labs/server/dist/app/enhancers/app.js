"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.appEnhancer = void 0;
function appEnhancer(app) {
    app.app.emit = (...args) => app.emit(...args);
    app.context.emit = (...args) => app.emit(...args);
    app.context.log = app.log;
    app.context.router = app.router;
    app.context.store = () => app.store();
    // Settings
    app.app.proxy = app.config('proxy', false);
    app.app.subdomainOffset = app.config('subdomainOffset', 2);
    // Params
    app.context.param = function param(key, coerce) {
        switch (coerce) {
            case 'id':
                return parseInt(this.params[key], 10);
            default:
                return this.params[key];
        }
    };
    // Defaults
    app.use(async (ctx, next) => {
        ctx.set('Server', app.config('headers.server', 'DLabs'));
        await next();
    });
}
exports.appEnhancer = appEnhancer;
