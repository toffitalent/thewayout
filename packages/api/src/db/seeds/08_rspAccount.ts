import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('rsp_accounts').del();

  await knex('rsp_accounts').insert([
    snakeCaseKeys(fixtures.rspAccount1),
    snakeCaseKeys(fixtures.rspAccount2),
    snakeCaseKeys(fixtures.rspAccount3),
    snakeCaseKeys(fixtures.rspAccount4),
    snakeCaseKeys(fixtures.rspAccount5),
    snakeCaseKeys(fixtures.rsp2AccountOwner),
    snakeCaseKeys(fixtures.rspAccountMember),
  ]);
}
