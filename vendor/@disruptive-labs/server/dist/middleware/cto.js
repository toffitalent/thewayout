"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cto = void 0;
function cto({ directive = 'nosniff' } = {}) {
    return async function ctoMiddleware(ctx, next) {
        ctx.set('X-Content-Type-Options', directive);
        await next();
    };
}
exports.cto = cto;
