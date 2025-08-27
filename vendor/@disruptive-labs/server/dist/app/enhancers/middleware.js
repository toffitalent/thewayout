"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middlewareEnhancer = void 0;
const middleware = __importStar(require("../../middleware"));
function middlewareEnhancer(app) {
    [
        // Core
        middleware.responseTime,
        middleware.logger,
        middleware.gzip,
        middleware.json,
        middleware.errors,
        middleware.requestId,
        middleware.methodOverride,
        // Security & headers
        middleware.cache,
        middleware.cors,
        middleware.csp,
        middleware.cto,
        middleware.hsts,
        middleware.referrer,
        middleware.xframe,
        middleware.xss,
        // API
        middleware.version,
        middleware.auth,
        middleware.throttle,
        middleware.parser,
        middleware.promise,
    ].forEach((middlewareFactory) => {
        const config = app.config(middlewareFactory.name, {});
        if (config.enabled !== false) {
            app.use(middlewareFactory(config, app));
        }
    });
}
exports.middlewareEnhancer = middlewareEnhancer;
