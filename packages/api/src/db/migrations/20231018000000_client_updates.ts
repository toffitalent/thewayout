import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('clients', (table) => {
    table.text('facility');
    table.text('expected_released_at');
    table.text('released_county');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('clients', (table) => {
    table.dropColumn('facility');
    table.dropColumn('expected_released_at');
    table.dropColumn('released_county');
  });
}
