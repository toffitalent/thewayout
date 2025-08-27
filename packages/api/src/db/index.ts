import { knex as createKnex } from 'knex';
import { knexSnakeCaseMappers, transaction as transactionBuilder } from 'objection';
import pg from 'pg';
import config from '@two/config';

// Perform parseInt on bigInt & numeric columns
// NOTE: Will cause issues if COUNT or column value exceed Number.MAX_INT
pg.defaults.parseInt8 = true;
pg.types.setTypeParser(1700, (val: string): number => parseFloat(val));

// Initialize knex
const knex = createKnex({
  acquireConnectionTimeout: 10000,
  client: 'pg',
  connection: {
    host: config.get('api.db.hostname'),
    port: config.get('api.db.port'),
    user: config.get('api.db.username'),
    password: config.get('api.db.password'),
    database: config.get('api.db.database'),
    charset: 'utf8',
  },
  debug: config.get('api.db.debug'),
  pool: {
    min: 2,
    max: 10,
  },
  useNullAsDefault: true,

  // Add `postProcessResponse` and `wrapIdentifier` hooks for converting snake_case to camelCase
  ...knexSnakeCaseMappers(),
});

// Bind knex instance to transaction method to avoid having to continuously pass it
const transaction = transactionBuilder.bind(knex, knex);

export { knex, transaction };
