/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Schema } from 'joi';
import type { Middleware } from '../types';
type Source = 'body' | 'headers' | 'params' | 'query';
export interface ValidationConfig {
    [source: string]: Schema;
}
export interface ValidationSchema {
    schema: Schema;
    source: Source;
}
export declare function validator(schemas: ValidationConfig): Middleware;
export {};
