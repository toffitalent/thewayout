"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
class Router extends koa_router_1.default {
    mount(path, router) {
        const instance = router || path;
        const middleware = instance instanceof Router ? instance.routes() : instance;
        if (router) {
            return this.use(path, middleware);
        }
        return this.use(middleware);
    }
}
exports.Router = Router;
