"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = void 0;
const uuid_1 = require("uuid");
function requestId() {
    return async function requestIdMiddleware(ctx, next) {
        // Generate request UUID
        const uuid = (0, uuid_1.v1)();
        ctx.requestId = uuid;
        // Set request id response header
        ctx.set('X-Request-Id', uuid);
        await next();
    };
}
exports.requestId = requestId;
