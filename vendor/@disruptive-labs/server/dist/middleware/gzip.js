"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gzip = void 0;
const koa_compress_1 = __importDefault(require("koa-compress"));
function gzip() {
    return (0, koa_compress_1.default)();
}
exports.gzip = gzip;
