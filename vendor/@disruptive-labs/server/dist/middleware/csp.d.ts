/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface CspConfig {
    directives?: {
        [key: string]: string[] | string | boolean;
    };
}
export declare function csp({ directives }?: CspConfig): Middleware;
