import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('jobs').del();

  await knex('jobs').insert([
    snakeCaseKeys(fixtures.job1),
    snakeCaseKeys(fixtures.job2),
    snakeCaseKeys(fixtures.job3),
    snakeCaseKeys(fixtures.job4),
  ]);
}
