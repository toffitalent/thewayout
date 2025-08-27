"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.promise = void 0;
function promise() {
    return async function promiseMiddleware(ctx, next) {
        await next();
        if (ctx.body) {
            ctx.body = await ctx.body;
        }
    };
}
exports.promise = promise;
