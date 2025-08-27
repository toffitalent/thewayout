"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.enhancers = void 0;
const app_1 = require("./app");
const errors_1 = require("./errors");
const middleware_1 = require("./middleware");
const responses_1 = require("./responses");
const router_1 = require("./router");
const enhancers = [
    app_1.appEnhancer,
    errors_1.errorsEnhancer,
    responses_1.responsesEnhancer,
    middleware_1.middlewareEnhancer,
    router_1.routerEnhancer,
];
exports.enhancers = enhancers;
