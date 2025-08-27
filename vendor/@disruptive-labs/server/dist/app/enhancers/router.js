"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerEnhancer = void 0;
const koa_compose_1 = __importDefault(require("koa-compose"));
function routerEnhancer(app) {
    app.use((0, koa_compose_1.default)([app.router.routes(), app.router.allowedMethods()]));
}
exports.routerEnhancer = routerEnhancer;
