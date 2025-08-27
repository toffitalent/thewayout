/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import { ArraySchema, Root } from 'joi';
interface Delimeter {
    delimeter(delimiter: string): this;
}
export type JoiDelimeter<T extends Root> = Omit<T, 'array'> & {
    array<TSchema = any[]>(): ArraySchema<TSchema> & Delimeter;
};
export declare function delimeter<T extends Root>(joi: T): JoiDelimeter<T>;
export {};
