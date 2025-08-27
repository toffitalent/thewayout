"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Serializer = exports.SerializerSymbol = void 0;
const utils_1 = require("./utils");
exports.SerializerSymbol = Symbol.for('objection.serializer');
class Serializer {
    $key(key) {
        return key;
    }
    $attribute(value) {
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    }
    async serialize(modelOrModels, options = {}) {
        const serializer = this.constructor;
        const attributes = options.attributes || serializer.attributes;
        const relations = options.relations || serializer.relations;
        const model = Array.isArray(modelOrModels) ? modelOrModels[0] : modelOrModels;
        // Ignore empty arrays or falsy values
        if (!model)
            return modelOrModels;
        // Detech and load relations
        const ModelClass = model.constructor;
        const relationsGraph = this.getRelationsGraph(ModelClass, relations);
        const result = relationsGraph
            ? await ModelClass.fetchGraph(modelOrModels, relationsGraph, { skipFetched: true })
            : modelOrModels;
        const properties = [...attributes, ...relations];
        return Array.isArray(result)
            ? Promise.all(result.map((item) => this.serializeProperties(item, properties, options)))
            : this.serializeProperties(result, properties, options);
    }
    // @ts-ignore
    getRelationsGraph(ModelClass, relations) {
        if (!relations.length)
            return null;
        const modelRelations = ModelClass.getRelations();
        return relations.reduce((graph, relation) => {
            if (!modelRelations[relation]) {
                throw new Error(`Unknown relation ${relation}`);
            }
            const RelationClass = modelRelations[relation].relatedModelClass;
            if ((0, utils_1.isSerializeModelClass)(RelationClass)) {
                const { Serializer: RelationSerializer } = RelationClass;
                const nestedRelations = RelationClass.serializeRelations || RelationSerializer.relations;
                return {
                    ...graph,
                    [relation]: this.getRelationsGraph(RelationClass, nestedRelations) || true,
                };
            }
            return { ...graph, [relation]: true };
        }, {});
    }
    // @ts-ignore
    async serializeProperties(model, properties, options) {
        const values = await Promise.all(properties.map((property) => {
            const value = model[property];
            if (typeof this[property] === 'function') {
                return this[property](value, model, options);
            }
            if (Array.isArray(value)) {
                return Promise.all((0, utils_1.isSerializeModel)(value[0])
                    ? value.map((item) => item.serialize(options))
                    : value.map((item) => this.$attribute(item)));
            }
            return (0, utils_1.isSerializeModel)(value) ? value.serialize(options) : this.$attribute(value);
        }));
        return values.reduce((result, value, index) => {
            if (typeof value === 'undefined')
                return result;
            const key = this.$key(properties[index]);
            result[key] = value;
            return result;
        }, {});
    }
}
exports.Serializer = Serializer;
Serializer.$$typeof = exports.SerializerSymbol;
Serializer.attributes = [];
Serializer.relations = [];
