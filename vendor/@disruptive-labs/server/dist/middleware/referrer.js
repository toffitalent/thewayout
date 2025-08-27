"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.referrer = void 0;
function referrer({ directive = ['origin-when-cross-origin', 'strict-origin-when-cross-origin'], } = {}) {
    return async function referrerMiddleware(ctx, next) {
        ctx.set('Referrer-Policy', Array.isArray(directive) ? directive.join(', ') : directive);
        await next();
    };
}
exports.referrer = referrer;
