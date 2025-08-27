"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.responsesEnhancer = void 0;
function responsesEnhancer(app) {
    app.context.send = function send(body) {
        this.body = body;
        this.status = body ? 200 : 204;
    };
    app.context.ok = app.context.send;
    app.context.created = function created(body) {
        this.body = body;
        this.status = 201;
    };
}
exports.responsesEnhancer = responsesEnhancer;
