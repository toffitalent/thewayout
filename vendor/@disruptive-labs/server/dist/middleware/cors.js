"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = void 0;
const cors_1 = __importDefault(require("@koa/cors"));
function cors({ origin, allowHeaders = [
    'Accept-Encoding',
    'Authorization',
    'Content-Type',
    'If-Match',
    'If-Modified-Since',
    'If-None-Match',
    'If-Unmodified-Since',
    'User-Agent',
    'X-Forwarded-Host',
    'X-Requested-With',
], allowMethods = ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'], exposeHeaders = [
    'ETag',
    'Link',
    'Location',
    'Retry-After',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset',
    'X-Request-Id',
    'X-Response-Time',
    'X-Total-Count',
], maxAge = 86400, } = {}) {
    return (0, cors_1.default)({
        origin,
        allowHeaders,
        allowMethods,
        exposeHeaders,
        maxAge,
        keepHeadersOnError: true,
    });
}
exports.cors = cors;
