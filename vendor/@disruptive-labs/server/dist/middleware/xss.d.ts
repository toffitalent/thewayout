/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface XssConfig {
    mode?: string;
}
export declare function xss({ mode }?: XssConfig): Middleware;
