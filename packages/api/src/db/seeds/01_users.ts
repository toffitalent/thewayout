import type { Knex } from 'knex';
import * as fixtures from '../fixtures';
import { createFakeUser, snakeCaseKeys } from '../utils';

export async function seed(knex: Knex) {
  await knex('apps').whereNotNull('user_id').del();
  await knex('users').where('username', '<>', 'josh@disruptivelabs.io').del();

  await knex('users').insert([
    snakeCaseKeys(fixtures.user1),
    snakeCaseKeys(fixtures.user2),
    snakeCaseKeys(fixtures.user3),
    snakeCaseKeys(fixtures.user4),
    snakeCaseKeys(fixtures.user5),
    snakeCaseKeys(fixtures.user6),
    snakeCaseKeys(fixtures.user7),
    snakeCaseKeys(fixtures.user8),
    snakeCaseKeys(fixtures.user9),
    snakeCaseKeys(fixtures.user10),
    snakeCaseKeys(fixtures.user11),
    snakeCaseKeys(fixtures.user12),
    snakeCaseKeys(fixtures.user13),
    snakeCaseKeys(fixtures.user14),
    snakeCaseKeys(fixtures.user15),
    snakeCaseKeys(fixtures.user16),
    snakeCaseKeys(fixtures.userClientVeteran1),
    snakeCaseKeys(fixtures.userClientVeteran2),
    snakeCaseKeys(fixtures.userRsp2Owner),
    snakeCaseKeys(fixtures.userRsp2Member),
    snakeCaseKeys(fixtures.rsp2UserClient1),
    snakeCaseKeys(fixtures.rsp2UserClient2),
    ...Array.from(Array(45), () => snakeCaseKeys(createFakeUser())),
    ...fixtures.users.map((user) => snakeCaseKeys(user)),
  ]);
}
