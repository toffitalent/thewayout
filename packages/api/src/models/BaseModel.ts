import { PaginateQueryBuilder, Serialize } from '@disruptive-labs/objection-plugins';
import { Model, ModelOptions, QueryContext } from 'objection';
import { knex } from '../db';

// Bind knex instance to objection
Model.knex(knex);

export class BaseModel extends Serialize(Model) {
  static QueryBuilder = PaginateQueryBuilder;
  QueryBuilderType!: PaginateQueryBuilder<this>;

  static useLimitInFirst = true;

  createdAt!: Date;
  updatedAt!: Date;

  async $beforeInsert(queryContext: QueryContext) {
    await super.$beforeInsert(queryContext);

    this.createdAt = new Date();
    this.updatedAt = this.createdAt;
  }

  async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
    await super.$beforeUpdate(opt, queryContext);

    this.updatedAt = new Date();
  }
}
