"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseTime = void 0;
function responseTime() {
    return async function responseTimeMiddleware(ctx, next) {
        const start = Date.now();
        await next();
        const delta = Math.ceil(Date.now() - start);
        ctx.set('X-Response-Time', `${delta}ms`);
    };
}
exports.responseTime = responseTime;
