import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('rsp_clients', (table) => {
    table.text('notes');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('rsp_clients', (table) => {
    table.dropColumn('notes');
  });
}
