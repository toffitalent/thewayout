import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('job_applications').del();

  await knex('job_applications').insert([
    snakeCaseKeys(fixtures.application1),
    snakeCaseKeys(fixtures.application2),
    snakeCaseKeys(fixtures.application3),
    snakeCaseKeys(fixtures.application4),
    snakeCaseKeys(fixtures.applicationVeteran1),
    snakeCaseKeys(fixtures.applicationVeteran2),
  ]);
}
