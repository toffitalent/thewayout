"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSerializeModelClass = exports.isSerializeModel = exports.isSerializer = void 0;
const Serializer_1 = require("./Serializer");
function isSerializer(object) {
    return (object === null || object === void 0 ? void 0 : object.$$typeof) === Serializer_1.SerializerSymbol;
}
exports.isSerializer = isSerializer;
function isSerializeModel(model) {
    return (model === null || model === void 0 ? void 0 : model.serialize) !== undefined;
}
exports.isSerializeModel = isSerializeModel;
function isSerializeModelClass(modelClass) {
    return modelClass.Serializer !== undefined;
}
exports.isSerializeModelClass = isSerializeModelClass;
