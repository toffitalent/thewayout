"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const lodash_1 = require("lodash");
const REGEX = /:([-\w]{2,})(?:\[([^\]]+)\])?/g;
function logger({ format = ':method :url :status :response-time ms - :length', } = {}) {
    return async function loggerMiddleware(ctx, next) {
        const startTime = new Date(Date.now());
        await next();
        if (format) {
            ctx.log.info(format.replace(REGEX, (_, key) => {
                var _a;
                switch (key) {
                    case 'app':
                    case 'user':
                        return ((_a = ctx.auth) === null || _a === void 0 ? void 0 : _a[`${key}Id`]) || '-';
                    case 'date':
                        return startTime.toISOString();
                    case 'id':
                        return ctx.requestId || '-';
                    case 'length':
                        return ctx.length || 0;
                    case 'response-time':
                        return Date.now() - startTime.getTime();
                    case 'referrer':
                    case 'user-agent':
                        return ctx.get(key);
                    default:
                        return (0, lodash_1.get)(ctx, key, '-');
                }
            }));
        }
    };
}
exports.logger = logger;
