"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.addWhereClauses = exports.getCursor = exports.getSign = exports.reverseSign = exports.reverseDirection = exports.isDesc = void 0;
function isDesc(str) {
    return typeof str === 'string' && str.toUpperCase() === 'DESC';
}
exports.isDesc = isDesc;
function reverseDirection(direction) {
    return isDesc(direction) ? 'ASC' : 'DESC';
}
exports.reverseDirection = reverseDirection;
function reverseSign(sign) {
    return sign === '>' ? '<' : '>';
}
exports.reverseSign = reverseSign;
function getSign(direction, reverse) {
    const sign = isDesc(direction) ? '<' : '>';
    return reverse ? reverseSign(sign) : sign;
}
exports.getSign = getSign;
function getCursor(orderedBy, model) {
    return orderedBy.map(({ column }) => model[column]);
}
exports.getCursor = getCursor;
function addWhereClauses(qb, [current, ...rest], prev, cursor, reverse) {
    const { values } = cursor;
    const { column, direction, table } = current;
    const index = prev.length;
    // Bail if no column or corresponding cursor value
    if (!current || values[index] == null)
        return;
    qb.orWhere((builder) => {
        // Add "greater than" or "less than" cursor value clause
        builder.andWhere(`${table}.${column}`, getSign(direction, reverse), values[index]);
        // For each previous cursor column, add "AND equals" clauses
        prev.forEach(({ column: prevCol, table: prevTable }, idx) => {
            builder.andWhere(`${prevTable}.${prevCol}`, '=', values[idx]);
        });
    });
    // Recursively add clauses until no more columns exist
    if (rest.length)
        addWhereClauses(qb, rest, [...prev, current], cursor, reverse);
}
exports.addWhereClauses = addWhereClauses;
