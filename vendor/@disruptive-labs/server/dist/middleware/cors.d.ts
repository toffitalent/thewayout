/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface CorsConfig {
    origin?: string | ((ctx: any) => string);
    allowHeaders?: string | string[];
    allowMethods?: string | string[];
    exposeHeaders?: string | string[];
    maxAge?: number;
}
export declare function cors({ origin, allowHeaders, allowMethods, exposeHeaders, maxAge, }?: CorsConfig): Middleware;
