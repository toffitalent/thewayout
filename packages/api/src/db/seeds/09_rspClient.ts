import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('rsp_clients').del();

  await knex('rsp_clients').insert([
    snakeCaseKeys(fixtures.rspClient1),
    snakeCaseKeys(fixtures.rspClient2),
    snakeCaseKeys(fixtures.rspClient3),
    snakeCaseKeys(fixtures.rspClient4),
    snakeCaseKeys(fixtures.rspClient5),
    snakeCaseKeys(fixtures.rspClient6),
    snakeCaseKeys(fixtures.rspClient7),
    snakeCaseKeys(fixtures.rspClientVeteran1),
    snakeCaseKeys(fixtures.rspClientVeteran2),
    snakeCaseKeys(fixtures.rsp2ClientJusticeImpacted),
    snakeCaseKeys(fixtures.rsp2ClientVeteran),
    ...fixtures.rspClients.map((rspClient) => snakeCaseKeys(rspClient)),
  ]);
}
