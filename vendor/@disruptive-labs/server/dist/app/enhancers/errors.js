"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorsEnhancer = void 0;
const errors_1 = require("../../errors");
function errorsEnhancer(app) {
    // Add error methods
    Object.getOwnPropertyNames(errors_1.RestError)
        .filter((key) => typeof errors_1.RestError[key] === 'function' && key !== 'wrap')
        .forEach((key) => {
        app.context[key] = errors_1.RestError[key];
    });
}
exports.errorsEnhancer = errorsEnhancer;
