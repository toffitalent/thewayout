/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import Redis from 'ioredis';
export interface StoreConfig {
    url?: string;
}
export declare const createStore: ({ url }?: StoreConfig) => Redis | null;
