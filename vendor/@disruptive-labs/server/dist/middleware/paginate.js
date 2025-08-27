"use strict";
/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const base64_url_1 = __importDefault(require("base64-url"));
const qs_1 = __importDefault(require("qs"));
function encodeCursor(cursor, encode = true) {
    if (cursor.length === 1 && (typeof cursor[0] === 'number' || !encode)) {
        return cursor[0];
    }
    return base64_url_1.default.escape(base64_url_1.default.encode(JSON.stringify(cursor)));
}
function parseCursor(cursor, before = true, encode = true) {
    let values;
    // Backwards-compatibility
    // TODO: Remove in next major
    if (/^[0-9]+$/.test(cursor)) {
        values = [parseInt(cursor, 10)];
    }
    else {
        values = encode ? JSON.parse(base64_url_1.default.decode(base64_url_1.default.unescape(cursor))) : [cursor];
    }
    return { type: before ? 'before' : 'after', values };
}
function getLinkParams(rel, { cursors: { after, before }, hasMore, page, }, encode = true) {
    switch (rel) {
        case 'next':
            if (page)
                return hasMore ? { page: page + 1 } : null;
            return after ? { after: encodeCursor(after, encode) } : null;
        case 'prev':
            if (page)
                return page > 1 ? { page: page - 1 } : null;
            return before ? { before: encodeCursor(before, encode) } : null;
        default:
            return null;
    }
}
function paginate({ encode = true, limit: defaultLimit = 25, links = ['next', 'prev'], max = 250, offset = false, } = {}) {
    return async function paginateMiddleware(ctx, next) {
        const limit = Math.min(ctx.query.limit || defaultLimit, max);
        let cursor;
        let page;
        if (offset) {
            page = Math.max(1, parseInt(ctx.query.page, 10));
        }
        else if (ctx.query.before || ctx.query.after) {
            // If both specified, use before
            cursor = parseCursor(ctx.query.before || ctx.query.after, !!ctx.query.before, encode);
        }
        ctx.pagination = {
            cursor,
            limit,
            page,
            meta: {},
        };
        await next();
        const { cursors = {}, total } = ctx.pagination.meta;
        if (links) {
            const hasMore = ctx.body.length === limit;
            const params = { cursors, hasMore, page };
            links.forEach((rel) => {
                const linkParams = getLinkParams(rel, params, encode);
                if (linkParams) {
                    ctx.append('Link', `<${ctx.path}?${qs_1.default.stringify({
                        ...ctx.query,
                        after: undefined,
                        before: undefined,
                        page: undefined,
                        ...linkParams,
                    })}>; rel="${rel}"`);
                }
            });
        }
        // Add X-Total-Count header if total available
        if (Number.isInteger(total)) {
            ctx.set('X-Total-Count', String(total));
        }
    };
}
exports.paginate = paginate;
