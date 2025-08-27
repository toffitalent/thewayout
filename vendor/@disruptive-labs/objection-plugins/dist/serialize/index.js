"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = exports.Serialize = void 0;
const Serializer_1 = require("./Serializer");
Object.defineProperty(exports, "Serializer", { enumerable: true, get: function () { return Serializer_1.Serializer; } });
const utils_1 = require("./utils");
function Serialize(Base) {
    var _a;
    // @ts-ignore
    return _a = class extends Base {
            static serialize(modelOrModels, ModelSerializer, options) {
                if ((0, utils_1.isSerializer)(ModelSerializer)) {
                    return new ModelSerializer().serialize(modelOrModels, options || {});
                }
                return new this.Serializer().serialize(modelOrModels, {
                    attributes: this.serializeAttributes,
                    relations: this.serializeRelations,
                    ...(ModelSerializer || {}),
                });
            }
            serialize(ModelSerializer, options) {
                if ((0, utils_1.isSerializer)(ModelSerializer)) {
                    return new ModelSerializer().serialize(this, options || {});
                }
                const ModelClass = this.constructor;
                return new ModelClass.Serializer().serialize(this, {
                    attributes: ModelClass.serializeAttributes,
                    relations: ModelClass.serializeRelations,
                    ...(ModelSerializer || {}),
                });
            }
            toJSON() {
                return {};
            }
        },
        _a.Serializer = Serializer_1.Serializer,
        _a;
}
exports.Serialize = Serialize;
