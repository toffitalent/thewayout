import { env, register } from '@two/config';

export const db = register('db', () => ({
  hostname: env('API_DB_HOSTNAME', 'localhost'),
  username: env('API_DB_USERNAME', 'two'),
  password: env('API_DB_PASSWORD', ''),
  database: env('API_DB_DATABASE', 'two'),
  debug: env('API_DB_DEBUG', false),
  port: env('API_DB_PORT', 5432),
}));
