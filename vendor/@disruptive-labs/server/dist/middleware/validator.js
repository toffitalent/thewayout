"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validator = void 0;
const errors_1 = require("../errors");
const defaultOptions = { abortEarly: false, allowUnknown: true };
const sources = ['body', 'headers', 'params', 'query'];
function getData(ctx, source) {
    switch (source) {
        case 'body':
            return ctx.request.body;
        default:
            return ctx[source];
    }
}
function setData(ctx, source, value) {
    switch (source) {
        case 'body':
            ctx.request.body = value;
            break;
        // NOTE: req.headers cannot be replaced so validated values are merged in, meaning that
        // stripping has no effect for headers
        case 'headers':
            Object.assign(ctx[source], value);
            break;
        // NOTE: Setting ctx.query sets the stringified ctx.querystring only, which must be reparsed on
        // the next call to ctx.query. To avoid reparsing and all values reverting to strings, we set
        // the converted data to ctx.request._querycache, with the new querystring as a key, so that
        // the converted data object is used and no reparsing is performed.
        case 'query':
            ctx.query = value;
            ctx.request._querycache[ctx.querystring] = value; // eslint-disable-line no-underscore-dangle
            break;
        default:
            ctx[source] = value;
    }
}
function validator(schemas) {
    const validationRules = [];
    // Iterate over supplied validation rules and combine into array
    Object.keys(schemas).forEach((key) => {
        const source = key;
        // Check if validation type is implemented
        if (sources.includes(source)) {
            validationRules.push({
                source,
                schema: schemas[source],
            });
        }
        else {
            throw new Error(`Validation type ${source} is not available!`);
        }
    });
    return async function validatorMiddleware(ctx, next) {
        const errors = [];
        validationRules.forEach((validationRule) => {
            const { source, schema } = validationRule;
            const data = getData(ctx, source) || {};
            const { error, value } = schema.validate(data, {
                ...defaultOptions,
                context: ctx,
                stripUnknown: source === 'body',
            });
            // Apply Joi type conversions to input
            setData(ctx, source, value);
            // Check validation result for errors
            if (error) {
                error.details.forEach((err) => {
                    errors.push({
                        source,
                        key: err.path,
                        error: err.message,
                    });
                });
            }
        });
        if (errors.length) {
            throw errors_1.RestError.invalidRequest('Validation failed', errors);
        }
        await next();
    };
}
exports.validator = validator;
