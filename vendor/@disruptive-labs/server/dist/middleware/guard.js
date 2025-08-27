"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.guard = void 0;
const errors_1 = require("../errors");
function guard(scopes = [], authorizer = undefined) {
    return async function guardMiddleware(ctx, next) {
        // Do not require authentication for OPTIONS requests
        if (ctx.method !== 'OPTIONS') {
            // Ensure user is authenticated
            if (!ctx.auth.userId) {
                throw errors_1.RestError.invalidCredentials('Authentication required');
            }
            // Validate required scopes, if any, are authorized
            if (scopes.length && !scopes.some((scope) => ctx.auth.scope.includes(scope))) {
                throw errors_1.RestError.insufficientScope('Insufficient scope has been authorized for this request');
            }
            // Validate user is authorized to access endpoint
            if (!ctx.auth.scope.includes('admin') && authorizer && !(await authorizer(ctx))) {
                throw errors_1.RestError.notAuthorized(`Not authorized to perform ${ctx.method} on resource ${ctx.path}`);
            }
        }
        await next();
    };
}
exports.guard = guard;
