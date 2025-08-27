/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import { Model } from 'objection';
export interface Cursor {
    type: 'before' | 'after';
    values: any[];
}
export interface Paginate<M extends Model> {
    cursors: {
        before?: any;
        after?: any;
    };
    results: M[];
    total: number;
}
