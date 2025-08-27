/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface HstsConfig {
    maxAge?: number;
    includeSubdomains?: boolean;
    preload?: boolean;
}
export declare function hsts({ maxAge, includeSubdomains, preload, }?: HstsConfig): Middleware;
