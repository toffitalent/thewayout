"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.xframe = void 0;
function xframe({ directive = 'deny' } = {}) {
    return async function xframeMiddleware(ctx, next) {
        ctx.set('X-Frame-Options', directive);
        await next();
    };
}
exports.xframe = xframe;
