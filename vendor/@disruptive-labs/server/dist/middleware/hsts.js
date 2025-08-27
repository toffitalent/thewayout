"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hsts = void 0;
function hsts({ maxAge = 0, includeSubdomains = true, preload = false, } = {}) {
    const value = `max-age=${maxAge}${includeSubdomains ? '; includeSubdomains' : ''}${preload ? '; preload' : ''}`;
    return async function hstsMiddleware(ctx, next) {
        if (maxAge) {
            ctx.set('Strict-Transport-Security', value);
        }
        await next();
    };
}
exports.hsts = hsts;
