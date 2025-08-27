"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.version = void 0;
const errors_1 = require("../errors");
function version({ availableVersions = [1] } = {}) {
    const defaultVersion = availableVersions[0];
    return async function versionMiddleware(ctx, next) {
        // Use regex to match /api/vX in request path
        const match = ctx.path.match(/^(?:\/api)?(?:\/v([0-9.]+))/);
        // Parse API version, or use default if no match
        ctx.version = match && match[1] ? parseFloat(match[1]) : defaultVersion;
        // Check if requested version is available
        if (!availableVersions.includes(ctx.version)) {
            throw errors_1.RestError.invalidVersion('Invalid API version');
        }
        // Set router path with /api and /vX removed
        ctx.routerPath = ctx.path.replace(/^(?:\/api)?(?:\/v[0-9.]+)?(?:\/)?/, '/');
        await next();
    };
}
exports.version = version;
