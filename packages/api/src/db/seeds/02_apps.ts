import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('apps').insert(snakeCaseKeys(fixtures.app));
  await knex('app_clients').insert(snakeCaseKeys(fixtures.client));
}
