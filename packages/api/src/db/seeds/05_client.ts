import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('clients').del();

  await knex('clients').insert([
    snakeCaseKeys(fixtures.clientProfile1),
    snakeCaseKeys(fixtures.clientProfile2),
    snakeCaseKeys(fixtures.clientProfile3),
    snakeCaseKeys(fixtures.clientProfile4),
    snakeCaseKeys(fixtures.clientProfile5),
    snakeCaseKeys(fixtures.clientProfile6),
    snakeCaseKeys(fixtures.clientProfile7),
    snakeCaseKeys(fixtures.clientProfileVeteran1),
    snakeCaseKeys(fixtures.clientProfileVeteran2),
    snakeCaseKeys(fixtures.rsp2Client1),
    snakeCaseKeys(fixtures.rsp2Client2),
    ...fixtures.clientsProfiles.map((clientProfile) => snakeCaseKeys(clientProfile)),
  ]);
}
