import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex('users').update({ last_name: '' }).whereNull('last_name');
}

export async function down(knex: Knex) {
  await knex('users').update({ last_name: null }).where('last_name', '');
}
