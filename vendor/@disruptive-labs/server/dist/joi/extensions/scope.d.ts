/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import { Root, SchemaMap } from 'joi';
interface Scope {
    admin(): this;
    scope(allowedScopes: string[]): this;
}
type JoiTypes = 'alternatives' | 'any' | 'array' | 'binary' | 'boolean' | 'date' | 'func' | 'function' | 'number' | 'object' | 'string' | 'symbol';
export type JoiScope<T extends Root> = Omit<T, JoiTypes> & {
    alternatives(): ReturnType<T['alternatives']> & Scope;
    any(): ReturnType<T['any']> & Scope;
    array(): ReturnType<T['array']> & Scope;
    binary(): ReturnType<T['binary']> & Scope;
    boolean(): ReturnType<T['boolean']> & Scope;
    date(): ReturnType<T['date']> & Scope;
    func(): ReturnType<T['func']> & Scope;
    function(): ReturnType<T['function']> & Scope;
    number(): ReturnType<T['number']> & Scope;
    object<TSchema = any, S = TSchema>(schema?: SchemaMap<S>): ReturnType<T['object']> & Scope;
    string(): ReturnType<T['string']> & Scope;
    symbol(): ReturnType<T['symbol']> & Scope;
};
export declare function scope<T extends Root>(joi: T): JoiScope<T>;
export {};
