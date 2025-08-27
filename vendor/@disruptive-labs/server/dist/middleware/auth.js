"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const errors_1 = require("../errors");
function parse(roles, claims) {
    // Split scope string into array and merge scopes inherited from special scopes
    const scope = (0, lodash_1.flattenDeep)(claims.scope.split(/\s+/).map((s) => (roles[s] ? [s, ...roles[s]] : s)));
    return {
        ...claims,
        // TODO: Remove `aud` fallback in next major release
        appId: claims.azp || claims.aud,
        userId: claims.sub,
        roles: scope.filter((item) => !!roles[item]),
        scope,
    };
}
function auth({ algorithm = 'HS256', audience, issuer, roles = {}, secret, } = {}) {
    return async function authMiddleware(ctx, next) {
        ctx.auth = {
            appId: null,
            userId: null,
            roles: [],
            scope: [],
            is(...args) {
                return args.some((arg) => this.userId === arg);
            },
            has(...args) {
                return args.some((arg) => this.scope.includes(arg));
            },
        };
        if (secret && ctx.get('Authorization')) {
            const token = ctx
                .get('Authorization')
                .replace(/^bearer\s+/i, '')
                .replace(/\s/g, '');
            try {
                Object.assign(ctx.auth, parse(roles, jsonwebtoken_1.default.verify(token, secret, { algorithms: [algorithm], audience, issuer })));
            }
            catch (err) {
                switch (err.name) {
                    case 'TokenExpiredError':
                        throw errors_1.RestError.invalidCredentials('Expired OAuth token');
                    default:
                        throw errors_1.RestError.invalidCredentials('Invalid OAuth token');
                }
            }
        }
        await next();
    };
}
exports.auth = auth;
