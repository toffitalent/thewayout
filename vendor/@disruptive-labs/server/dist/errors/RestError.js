"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestError = void 0;
const statuses_1 = __importDefault(require("statuses"));
class RestError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.code = 'UnknownError';
        this.status = 500;
        this.errors = [];
        this.headers = {};
        const { errors = [], ...opts } = options;
        Object.assign(this, opts);
        errors.forEach(({ key, error = 'invalid', source = 'body' }) => {
            if (key) {
                this.errors.push({
                    error,
                    source,
                    key: Array.isArray(key) ? key : [key],
                });
            }
        });
    }
    toJSON() {
        const data = {
            status: this.status,
            code: this.code || 'UnknownError',
            message: this.message || String((0, statuses_1.default)(this.status)),
        };
        if (this.data)
            data.data = this.data;
        if (this.errors.length)
            data.errors = this.errors;
        return data;
    }
    static wrap(error, expose = false) {
        if (error instanceof RestError)
            return error;
        return new RestError(expose ? error.message : 'An error occurred', {
            status: error.statusCode || error.status || 500,
            code: error.code || 'ApiError',
            data: expose ? error : undefined,
            headers: error.headers || {},
        });
    }
    static apiError(message, data) {
        return new RestError(message, { data, code: 'ApiError', status: 500 });
    }
    static badMethod(message, data, allow) {
        const error = new RestError(message, { data, code: 'BadMethod', status: 405 });
        if (allow) {
            error.headers.Allow = allow.join(', ');
        }
        return error;
    }
    static badRequest(message, data) {
        return new RestError(message, { data, code: 'BadRequest', status: 400 });
    }
    static insufficientScope(message, data) {
        return new RestError(message, { data, code: 'InsufficientScope', status: 403 });
    }
    static invalidCredentials(message, data) {
        return new RestError(message, { data, code: 'InvalidCredentials', status: 401 });
    }
    static invalidRequest(message, errors, data) {
        return new RestError(message, {
            data,
            errors: Array.isArray(errors) ? errors : [errors],
            code: 'InvalidRequest',
            status: 400,
        });
    }
    static invalidVersion(message, data) {
        return new RestError(message, { data, code: 'InvalidVersion', status: 400 });
    }
    static maintenance(message) {
        return new RestError(message, { code: 'Maintenance', status: 503 });
    }
    static notAuthorized(message, data) {
        return new RestError(message, { data, code: 'NotAuthorized', status: 403 });
    }
    static outOfInventory(message, data) {
        return new RestError(message, { data, code: 'OutOfInventory', status: 400 });
    }
    static paymentDeclined(message, data) {
        return new RestError(message, { data, code: 'PaymentDeclined', status: 402 });
    }
    static requestThrottled(message, data, retry) {
        const error = new RestError(message, { data, code: 'RequestThrottled', status: 429 });
        if (retry) {
            error.headers['Retry-After'] = String(retry);
        }
        return error;
    }
    static resourceConflict(message, errors = [], data) {
        return new RestError(message, {
            code: 'ResourceConflict',
            status: 409,
            data,
            errors: Array.isArray(errors) ? errors : [errors],
        });
    }
    static resourceNotFound(message, data) {
        return new RestError(message, { data, code: 'ResourceNotFound', status: 404 });
    }
    static serverError(message, data) {
        return new RestError(message, { data, code: 'ServerError', status: 500 });
    }
}
exports.RestError = RestError;
