"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.Level = void 0;
/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
const chalk_1 = __importDefault(require("chalk"));
var Level;
(function (Level) {
    Level[Level["none"] = 0] = "none";
    Level[Level["error"] = 1] = "error";
    Level[Level["warn"] = 2] = "warn";
    Level[Level["info"] = 3] = "info";
    Level[Level["debug"] = 4] = "debug";
})(Level = exports.Level || (exports.Level = {}));
function colorize(message, level) {
    switch (level) {
        case Level.error:
            return chalk_1.default.red(message);
        case Level.info:
            return chalk_1.default.blue(message);
        case Level.warn:
            return chalk_1.default.yellow(message);
        default:
            return message;
    }
}
class Log {
    constructor({ colors = false, level = 'debug' } = {}) {
        this.level = Level[level];
        this.colors = colors;
    }
    log(level, message, ...rest) {
        if (level > this.level)
            return;
        const formatted = this.colors ? colorize(message, level) : message;
        console.log(formatted, ...rest);
    }
    error(error, ...rest) {
        this.log(Level.error, error, ...rest);
    }
    warn(message, ...rest) {
        this.log(Level.warn, message, ...rest);
    }
    info(message, ...rest) {
        this.log(Level.info, message, ...rest);
    }
    debug(message, ...rest) {
        this.log(Level.debug, message, ...rest);
    }
}
exports.Log = Log;
