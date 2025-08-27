"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const createStore = ({ url } = {}) => {
    if (!url)
        return null;
    return new ioredis_1.default(url, {
        autoResendUnfulfilledCommands: true,
        enableOfflineQueue: true,
        lazyConnect: true,
        reconnectOnError: (err) => {
            // Reconnect when error message starts with "READONLY" (for ElastiCache failover)
            const targetError = 'READONLY';
            if (err.message.slice(0, targetError.length) === targetError) {
                return true;
            }
            return false;
        },
    });
};
exports.createStore = createStore;
