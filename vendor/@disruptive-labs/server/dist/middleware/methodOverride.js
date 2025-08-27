"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.methodOverride = void 0;
function methodOverride() {
    return async function methodOverrideMiddleware(ctx, next) {
        // Check for X-HTTP-Method-Override header and override HTTP method
        // NOTE: Method overriding is only allowed for POST requests
        if (ctx.get('X-HTTP-Method-Override') && ctx.method === 'POST') {
            ctx.method = ctx.get('X-HTTP-Method-Override').toUpperCase();
        }
        await next();
    };
}
exports.methodOverride = methodOverride;
