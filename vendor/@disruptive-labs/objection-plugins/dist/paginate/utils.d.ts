/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import { QueryBuilder } from 'objection';
import { Cursor } from './types';
export declare function isDesc(str: any): boolean;
export declare function reverseDirection(direction: any): string;
export declare function reverseSign(sign: string): string;
export declare function getSign(direction: any, reverse: boolean): string;
export interface OrderedBy {
    column: string;
    direction: string;
    table: string;
}
export declare function getCursor(orderedBy: OrderedBy[], model: any): any[];
export declare function addWhereClauses<QB extends QueryBuilder<any, any>>(qb: QB, [current, ...rest]: OrderedBy[], prev: OrderedBy[], cursor: Cursor, reverse: boolean): void;
