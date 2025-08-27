"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.scope = void 0;
const lodash_1 = require("lodash");
function scope(joi) {
    const types = {
        alternatives: joi.alternatives(),
        any: joi.any(),
        array: joi.array(),
        binary: joi.binary(),
        boolean: joi.boolean(),
        date: joi.date(),
        function: joi.func(),
        number: joi.number(),
        object: joi.object(),
        string: joi.string(),
        symbol: joi.symbol(),
    };
    return Object.entries(types).reduce((extended, [type, base]) => extended.extend({
        type,
        base,
        coerce(value, { schema, prefs }) {
            const scopes = schema.$_getFlag('scopes');
            if (scopes &&
                !(0, lodash_1.get)(prefs, 'context.auth.scope', []).some((authorized) => scopes.includes(authorized))) {
                return { value: undefined };
            }
            return { value };
        },
        rules: {
            admin: {
                method() {
                    return this.$_setFlag('scopes', ['admin']);
                },
            },
            scope: {
                method(allowedScopes) {
                    return this.$_setFlag('scopes', allowedScopes);
                },
                args: [
                    {
                        name: 'allowedScopes',
                        assert: (value) => Array.isArray(value),
                        message: 'must be an array',
                    },
                ],
            },
        },
    }), joi);
}
exports.scope = scope;
