/**
 * DISRUPTIVE LABS LLC CONFIDENTIAL
 * Copyright (c) 2019-Present Disruptive Labs LLC. All Rights Reserved.
 */
import { Model, Page, QueryBuilder } from 'objection';
import { Cursor, Paginate } from './types';
export declare class PaginateQueryBuilder<M extends Model, R = M[]> extends QueryBuilder<M, R> {
    ArrayQueryBuilderType: PaginateQueryBuilder<M, M[]>;
    SingleQueryBuilderType: PaginateQueryBuilder<M, M>;
    NumberQueryBuilderType: PaginateQueryBuilder<M, number>;
    PageQueryBuilderType: PaginateQueryBuilder<M, Page<M>>;
    PaginateQueryBuilderType: PaginateQueryBuilder<M, Paginate<M>>;
    paginate({ cursor, limit }: {
        cursor?: Cursor;
        limit: number;
    }): this['PaginateQueryBuilderType'];
    paginate({ page, limit }: {
        page: number;
        limit: number;
    }): this['PageQueryBuilderType'];
}
