/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Middleware } from '../types';
export interface Cursor {
    type: 'before' | 'after';
    values: number[] | string[];
}
export interface PaginateConfig {
    encode?: boolean;
    limit?: number;
    links?: string[] | null;
    max?: number;
    offset?: boolean;
}
export interface PaginateContext {
    cursor?: Cursor;
    limit: number;
    page?: number;
    meta: {
        [key: string]: any;
    };
}
export declare function paginate({ encode, limit: defaultLimit, links, max, offset, }?: PaginateConfig): Middleware;
