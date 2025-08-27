/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface VersionConfig {
    availableVersions?: number[];
}
export declare function version({ availableVersions }?: VersionConfig): Middleware;
