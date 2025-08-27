import { app } from '@app/app';
import { knex } from '@app/db';

export function resetDb() {
  return knex.seed.run({
    directory: './src/db/seeds',
  });
}

export function resetStore() {
  return app.store().flushall();
}
