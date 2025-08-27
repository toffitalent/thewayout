/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import type { Model, ModelClass } from 'objection';
import type { SerializeModel, SerializeModelClass } from './types';
import { Serializer } from './Serializer';
export declare function isSerializer(object?: Record<string, any>): object is typeof Serializer;
export declare function isSerializeModel(model: any): model is SerializeModel;
export declare function isSerializeModelClass(modelClass: ModelClass<Model>): modelClass is SerializeModelClass;
