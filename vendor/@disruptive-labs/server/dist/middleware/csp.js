"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.csp = void 0;
function csp({ directives = {} } = {}) {
    const policy = Object.keys(directives)
        .reduce((result, key) => {
        const directive = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        const value = directives[key];
        if (value === true)
            return result.concat(directive);
        return result.concat(`${directive} ${Array.isArray(value) ? value.join(' ') : value}`);
    }, [])
        .join('; ');
    return async function cspMiddleware(ctx, next) {
        if (policy) {
            ctx.set('Content-Security-Policy', policy);
        }
        await next();
    };
}
exports.csp = csp;
