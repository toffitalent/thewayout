import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex('clients')
    .update('justice_status', knex.ref('probation_or_parole'))
    .whereIn('justice_status', ['freeWorld', 'halfwayHouse'])
    .whereNotNull('probation_or_parole');

  await knex('clients')
    .update({ justice_status: 'freeWorld' })
    .whereIn('justice_status', ['deferredSentence', 'workRelease', 'atr']);

  await knex.schema.alterTable('clients', (table) => {
    table.dropColumn('probation_or_parole');
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('clients', (table) => {
    table.text('probation_or_parole');
  });
}
