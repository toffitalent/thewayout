import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('employers').del();

  await knex('employers').insert([snakeCaseKeys(fixtures.employer1)]);
}
