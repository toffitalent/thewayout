/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import { Model } from 'objection';
import { Serializer } from './Serializer';
import type { SerializeStatic, SerializeInstance } from './types';
interface SerializePlugin<T extends typeof Model> extends SerializeStatic {
    new (...args: any[]): InstanceType<T> & SerializeInstance;
}
export declare function Serialize<T extends typeof Model>(Base: T): Omit<T, 'new'> & SerializePlugin<T>;
export { Serializer };
