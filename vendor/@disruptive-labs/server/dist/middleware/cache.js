"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
function cache({ maxAge = 0 } = {}) {
    return async function cacheMiddleware(ctx, next) {
        ctx.set('Cache-Control', maxAge ? `max-age=${maxAge}` : 'no-cache');
        await next();
    };
}
exports.cache = cache;
