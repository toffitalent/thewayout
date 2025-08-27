"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Joi = void 0;
const joi_1 = __importDefault(require("joi"));
const delimeter_1 = require("./extensions/delimeter");
const scope_1 = require("./extensions/scope");
const Joi = (0, scope_1.scope)((0, delimeter_1.delimeter)(joi_1.default.extend({
    type: 'alternatives',
    base: joi_1.default.alternatives(),
}, {
    type: 'any',
    base: joi_1.default.any(),
}, {
    type: 'array',
    base: joi_1.default.array(),
}, {
    type: 'binary',
    base: joi_1.default.binary(),
}, {
    type: 'boolean',
    base: joi_1.default.boolean(),
}, {
    type: 'date',
    base: joi_1.default.date().allow(null).empty(null),
}, {
    type: 'function',
    base: joi_1.default.func(),
}, {
    type: 'number',
    base: joi_1.default.number().allow(null).empty(null),
}, {
    type: 'object',
    base: joi_1.default.object(),
}, {
    type: 'string',
    // Allow empty string by default for non-required values
    base: joi_1.default.string().allow('', null).empty(null),
}, {
    type: 'symbol',
    base: joi_1.default.symbol(),
})));
exports.Joi = Joi;
