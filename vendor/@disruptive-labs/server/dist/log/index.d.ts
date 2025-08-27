/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
export declare enum Level {
    none = 0,
    error = 1,
    warn = 2,
    info = 3,
    debug = 4
}
export interface LogConfig {
    level?: keyof typeof Level;
    colors?: boolean;
}
export declare class Log {
    private level;
    private colors;
    constructor({ colors, level }?: LogConfig);
    private log;
    error(error: Error, ...rest: any[]): void;
    warn(message: any, ...rest: any[]): void;
    info(message: any, ...rest: any[]): void;
    debug(message: any, ...rest: any[]): void;
}
