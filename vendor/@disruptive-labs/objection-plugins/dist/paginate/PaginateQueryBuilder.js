"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginateQueryBuilder = void 0;
const objection_1 = require("objection");
const utils = __importStar(require("./utils"));
class PaginateQueryBuilder extends objection_1.QueryBuilder {
    paginate({ cursor, limit, page, }) {
        // If using offset pagination, use .page method
        if (page)
            return this.page(page - 1, limit);
        // Clone builder for total calculation
        const resultSizeBuilder = this.clone();
        // Add limit clause
        this.limit(limit + 1);
        // Add orderBy descending ID if no order specified
        if (!this.has('orderBy'))
            this.orderBy('id', 'DESC');
        const orderedBy = [];
        let reverse = false;
        return this.runBefore((result, builder) => {
            // Extract the columns being used for order to match them with cursor values
            builder.forEachOperation('orderBy', ({ args }) => {
                const [columnName, direction] = args;
                const [column, table] = columnName.split('.').reverse();
                orderedBy.push({
                    column,
                    direction: utils.isDesc(direction) ? 'DESC' : 'ASC',
                    table: table || builder.tableRefFor(builder.modelClass()),
                });
                // Reverse orderBy direction, if necessary
                if (cursor &&
                    ((cursor.type === 'after' && utils.isDesc(direction)) ||
                        (cursor.type === 'before' && !utils.isDesc(direction)))) {
                    reverse = true;
                    args[1] = utils.reverseDirection(direction);
                }
            });
            // Add where clauses
            if (cursor) {
                builder.andWhere((qb) => utils.addWhereClauses(qb, orderedBy, [], cursor, reverse));
            }
            return result;
        }).runAfter(async (modelResults) => {
            const models = Array.isArray(modelResults) ? modelResults : [modelResults];
            const hasMore = models.length > limit;
            // Remove extra model used to check if more results exist
            if (hasMore)
                models.pop();
            // Reverse the results if necessary to always return rows in the order specified by orderBy
            const results = reverse ? models.reverse() : models;
            // Get total count
            const total = await resultSizeBuilder.resultSize();
            const res = {
                cursors: { after: null, before: null },
                results: models,
                total,
            };
            // Get new cursors
            if (results.length) {
                const type = cursor && cursor.type;
                const [{ direction }] = orderedBy;
                const desc = utils.isDesc(direction);
                const first = models[0];
                const last = models[models.length - 1];
                // Flip first/last depending on sort order
                const after = desc ? first : last;
                const before = desc ? last : first;
                // Create cursors for next/previous models
                if (type === 'before' || hasMore)
                    res.cursors.after = utils.getCursor(orderedBy, after);
                if (type === 'after' || hasMore)
                    res.cursors.before = utils.getCursor(orderedBy, before);
            }
            return res;
        });
    }
}
exports.PaginateQueryBuilder = PaginateQueryBuilder;
