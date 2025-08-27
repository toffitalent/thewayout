"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewriter = void 0;
const lodash_1 = require("lodash");
const path_to_regexp_1 = require("path-to-regexp");
function rewriter(src, dest) {
    const params = [];
    const regexp = (0, path_to_regexp_1.pathToRegexp)(src, params);
    // Convert params to simple array of param names
    const paramNames = params.map((param) => param.name);
    return async function rewriterMiddleware(ctx, next) {
        const m = regexp.exec(ctx.routerPath || ctx.path);
        if (m) {
            ctx.routerPath = dest.replace(/\$(\d+)|(?::(\w+))|\$([\w.]+)/g, (_, n, name, ctxVar) => {
                // Replace context variables in dest (/$auth.userId or /$ctx.auth.userId)
                if (ctxVar) {
                    return (0, lodash_1.get)(ctx, ctxVar.replace(/^ctx\./, '')) || '';
                }
                // Replace named parameters in dest (/:username)
                if (name) {
                    return m[paramNames.indexOf(name) + 1];
                }
                // Replace numbered parameters in dest (/$1)
                return m[n];
            });
        }
        await next();
    };
}
exports.rewriter = rewriter;
