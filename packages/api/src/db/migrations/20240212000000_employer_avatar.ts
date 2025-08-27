import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('employers', (table) => {
    table.text('avatar');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('employers', (table) => {
    table.dropColumn('avatar');
  });
}
