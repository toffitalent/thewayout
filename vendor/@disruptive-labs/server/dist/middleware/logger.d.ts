/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface LoggerConfig {
    format?: string;
}
export declare function logger({ format, }?: LoggerConfig): Middleware;
