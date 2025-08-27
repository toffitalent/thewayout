"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.param = void 0;
function coerce(type, value) {
    switch (type) {
        case 'id':
            return parseInt(value, 10) || 0;
        default:
            return value;
    }
}
function param(key, type = 'id') {
    return async function paramMiddleware(ctx, next) {
        ctx.params[key] = coerce(type, ctx.params[key]);
        await next();
    };
}
exports.param = param;
