/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface CtoConfig {
    directive?: string;
}
export declare function cto({ directive }?: CtoConfig): Middleware;
