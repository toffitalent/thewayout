/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Redis } from 'ioredis';
import type { Middleware } from '../types';
export interface ThrottleConfig {
    duration?: number;
    max?: number;
    maxAuth?: number;
    maxUnauth?: number;
    redis?: Redis;
}
export interface ThrottleContext {
    id: string;
    limit: number;
    current: number;
    remaining: number;
    reset: number;
}
export declare function throttle({ duration, max, maxAuth, maxUnauth, redis, }?: ThrottleConfig): Middleware;
