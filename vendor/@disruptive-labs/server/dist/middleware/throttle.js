"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.throttle = void 0;
const lodash_1 = require("lodash");
const errors_1 = require("../errors");
function throttle({ duration = 900, max = 450, maxAuth, maxUnauth, redis, } = {}) {
    const id = (0, lodash_1.uniqueId)();
    const limitAuth = maxAuth || max || 0;
    const limitUnauth = maxUnauth || max || 0;
    async function increment(store, key) {
        var _a;
        const [[, count], [, exp]] = (_a = (await store.multi().incr(key).ttl(key).exec())) !== null && _a !== void 0 ? _a : [];
        const current = parseInt(count, 10) || 0;
        const ttl = parseInt(exp, 10) || 0;
        // Set expiration if first request or no expiration set
        if (current === 1 || ttl === -1) {
            await store.expire(key, duration);
        }
        return { current, reset: ttl > 0 ? ttl : duration };
    }
    return async function throttleMiddleware(ctx, next) {
        var _a, _b;
        const store = redis || ctx.store();
        const limit = ((_a = ctx.auth) === null || _a === void 0 ? void 0 : _a.userId) ? limitAuth : limitUnauth;
        const identifier = ((_b = ctx.auth) === null || _b === void 0 ? void 0 : _b.userId) || ctx.ip;
        const key = `tl:${id}:${identifier}`;
        // Add default throttle object to context
        ctx.throttle = {
            id,
            limit,
            current: 0,
            remaining: limit,
            reset: duration,
        };
        try {
            const { current, reset } = await increment(store, key);
            const remaining = Math.max(limit - current, 0);
            ctx.throttle = {
                ...ctx.throttle,
                current,
                remaining,
                reset,
            };
            ctx.set('X-RateLimit-Limit', String(limit));
            ctx.set('X-RateLimit-Remaining', String(remaining));
            ctx.set('X-RateLimit-Reset', String(Math.floor(Date.now() / 1000) + reset));
        }
        catch (err) {
            // Don't block requests if Redis is down
            ctx.emit('error', err, ctx);
        }
        if (ctx.throttle.current > ctx.throttle.limit) {
            ctx.set('Retry-After', String(ctx.throttle.reset));
            throw errors_1.RestError.requestThrottled(`Rate limit exceeded. Retry your request in ${ctx.throttle.reset} seconds.`);
        }
        let downstreamError;
        try {
            await next();
        }
        catch (err) {
            downstreamError = err;
        }
        // Decrement if handled downstream or error occurred
        if (ctx.throttle.id !== id || downstreamError || ctx.status >= 500) {
            try {
                await store.decr(key);
            }
            catch (err) {
                ctx.emit('error', err, ctx);
            }
        }
        if (downstreamError)
            throw downstreamError;
    };
}
exports.throttle = throttle;
