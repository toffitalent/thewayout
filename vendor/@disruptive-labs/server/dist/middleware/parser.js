"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.onError = void 0;
const koa_body_1 = __importStar(require("koa-body"));
const unparsed_1 = __importDefault(require("koa-body/lib/unparsed"));
const koa_compose_1 = __importDefault(require("koa-compose"));
const errors_1 = require("../errors");
function onError(error) {
    switch (error.type) {
        case 'entity.too.large':
        case 'encoding.unsupported':
            throw errors_1.RestError.badRequest('Invalid request body');
        default:
            throw errors_1.RestError.badRequest('Body could not be parsed');
    }
}
exports.onError = onError;
function parser({ encoding = 'utf-8', formLimit = '56kb', includeUnparsed = true, json = true, jsonLimit = '1mb', multipart = false, parsedMethods = [koa_body_1.HttpMethodEnum.POST, koa_body_1.HttpMethodEnum.PATCH, koa_body_1.HttpMethodEnum.PUT], text = false, textLimit = '56kb', urlencoded = true, ...bodyOptions } = {}) {
    return (0, koa_compose_1.default)([
        async function parserMiddleware(ctx, next) {
            if ((!json && ctx.is('json')) ||
                (!urlencoded && ctx.is('urlencoded')) ||
                (!text && ctx.is('text')) ||
                (!multipart && ctx.is('multipart'))) {
                throw errors_1.RestError.badRequest('Invalid request body');
            }
            // Set default empty body
            ctx.request.body = {};
            ctx.request.rawBody = null;
            await next();
        },
        (0, koa_body_1.default)({
            encoding,
            formLimit,
            includeUnparsed,
            json,
            jsonLimit,
            multipart,
            parsedMethods,
            text,
            textLimit,
            urlencoded,
            onError,
            jsonStrict: true,
            patchNode: false,
            patchKoa: true,
            ...bodyOptions,
        }),
        async function parserMiddleBody(ctx, next) {
            if (includeUnparsed) {
                ctx.request.rawBody = ctx.request.body[unparsed_1.default];
                delete ctx.request.body[unparsed_1.default];
            }
            await next();
        },
    ]);
}
exports.parser = parser;
