"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.xss = void 0;
function xss({ mode = 'block' } = {}) {
    const value = `1${mode ? `; mode=${mode}` : ''}`;
    return async function xssMiddleware(ctx, next) {
        ctx.set('X-XSS-Protection', value);
        await next();
    };
}
exports.xss = xss;
