/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Options, Serialized, SerializeModel } from './types';
export declare const SerializerSymbol: unique symbol;
export declare class Serializer {
    [key: string]: any;
    static $$typeof: symbol;
    static attributes: string[];
    static relations: string[];
    $key(key: string | number): string | number;
    $attribute(value: any): any;
    serialize(modelOrModels: SerializeModel | SerializeModel[], options?: Options): Promise<Serialized | Serialized[]>;
    private getRelationsGraph;
    private serializeProperties;
}
