/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Model, ModelClass } from 'objection';
import type { Serializer } from './Serializer';
export declare type Options = Record<string, any>;
export declare type Serialized = Record<string | number, any>;
export interface SerializeInstance {
    serialize(serializer: typeof Serializer, options?: Options): Promise<Serialized | Serialized[]>;
    serialize(options?: Options): Promise<Serialized | Serialized[]>;
}
export interface SerializeModel extends Model, SerializeInstance {
}
export interface SerializeStatic {
    Serializer: typeof Serializer;
    /**
     * For use with default serializer
     */
    serializeAttributes?: string[];
    serializeRelations?: string[];
    serialize<T extends SerializeModel>(modelOrModels: T | T[], serializer: typeof Serializer, options?: Options): Promise<Serialized | Serialized[]>;
    serialize<T extends SerializeModel>(modelOrModels: T | T[], options?: Options): Promise<Serialized | Serialized[]>;
}
export interface SerializeModelClass extends ModelClass<SerializeModel>, SerializeStatic {
}
