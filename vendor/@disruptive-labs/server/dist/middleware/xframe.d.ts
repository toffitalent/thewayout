/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
type Directive = 'deny' | 'sameorigin';
export interface XframeConfig {
    directive?: Directive;
}
export declare function xframe({ directive }?: XframeConfig): Middleware;
export {};
