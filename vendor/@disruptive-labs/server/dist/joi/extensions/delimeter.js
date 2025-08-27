"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.delimeter = void 0;
function delimeter(joi) {
    return joi.extend({
        type: 'array',
        base: joi.array(),
        coerce(value, { schema }) {
            if (schema.$_getFlag('delimeter') && typeof value === 'string') {
                return { value: value.split(schema.$_getFlag('delimeter')) };
            }
            return { value };
        },
        rules: {
            delimeter: {
                method(delimeterStr) {
                    return this.$_setFlag('delimeter', delimeterStr);
                },
                args: [
                    {
                        name: 'delimeterStr',
                        assert: (value) => typeof value === 'string' && !!value,
                        message: 'must be a string',
                    },
                ],
            },
        },
    });
}
exports.delimeter = delimeter;
