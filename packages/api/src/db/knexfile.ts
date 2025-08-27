import '../config';

import config from '@two/config';

// Perform parseInt on bigInt columns
// NOTE: Will cause issues if COUNT or column value exceed Number.MAX_INT
require('pg').defaults.parseInt8 = true;

export default {
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
  migrations: {
    directory: './migrations',
    disableTransactions: false,
    extension: 'js',
    tableName: 'migrations',
  },
  pool: {
    min: 1,
    max: 1,
  },
  seeds: {
    directory: './seeds',
  },
  useNullAsDefault: true,
};
