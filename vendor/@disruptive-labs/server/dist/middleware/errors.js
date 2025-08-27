"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = void 0;
const errors_1 = require("../errors");
function errors() {
    return async function errorsMiddleware(ctx, next) {
        try {
            await next();
        }
        catch (err) {
            // Log error, if server-side or unknown
            if (!(err instanceof errors_1.RestError) || err.status >= 500) {
                ctx.log.error(err, ctx);
                ctx.emit('error', err, ctx);
            }
            ctx.body = errors_1.RestError.wrap(err);
        }
        if (ctx.response.headers.location) {
            return;
        }
        if (!ctx.body) {
            switch (ctx.status) {
                case 204:
                    break;
                case 405:
                    ctx.body = errors_1.RestError.badMethod(`Method ${ctx.method} not allowed on resource ${ctx.path}`);
                    break;
                default:
                    ctx.body = errors_1.RestError.resourceNotFound(`Resource ${ctx.path} not found`);
            }
        }
        if (ctx.body instanceof errors_1.RestError) {
            ctx.status = ctx.body.status;
            ctx.set(ctx.body.headers);
            // Disable caching of error responses
            ctx.set('Cache-Control', 'no-cache');
        }
    };
}
exports.errors = errors;
