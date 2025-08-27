import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('rsp').del();

  await knex('rsp').insert([snakeCaseKeys(fixtures.rsp1), snakeCaseKeys(fixtures.rsp2)]);
}
