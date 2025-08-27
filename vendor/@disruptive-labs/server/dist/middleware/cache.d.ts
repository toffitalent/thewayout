/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface CacheConfig {
    maxAge?: number;
}
export declare function cache({ maxAge }?: CacheConfig): Middleware;
