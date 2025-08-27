import { Knex } from 'knex';
import { VeteranOrJustice } from '@two/shared';

export async function up(knex: Knex) {
  await knex.schema.alterTable('clients', (table) => {
    table
      .specificType('veteran_or_justice', 'text[]')
      .defaultTo(`{${VeteranOrJustice.justiceImpacted}}`);
    table.specificType('veteran_service', 'text[]');
    table.text('veteran_rank');
    table.date('veteran_start_at');
    table.date('veteran_end_at');
    table.boolean('veteran_reservist');
    table.specificType('veteran_campaigns', 'text[]');
    table.text('veteran_type_discharge');
    table.boolean('veteran_dd214');
  });

  await knex.schema.alterTable('jobs', (table) => {
    table
      .specificType('veteran_or_justice', 'text[]')
      .defaultTo(`{${VeteranOrJustice.justiceImpacted}, ${VeteranOrJustice.veteran}}`);
  });

  await knex.schema.alterTable('rsp', (table) => {
    table
      .specificType('veteran_or_justice', 'text[]')
      .defaultTo(`{${VeteranOrJustice.justiceImpacted}}`);
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('clients', (table) => {
    table.dropColumn('veteran_or_justice');
    table.dropColumn('veteran_service');
    table.dropColumn('veteran_rank');
    table.dropColumn('veteran_start_at');
    table.dropColumn('veteran_end_at');
    table.dropColumn('veteran_reservist');
    table.dropColumn('veteran_campaigns');
    table.dropColumn('veteran_type_discharge');
    table.dropColumn('veteran_dd214');
  });

  await knex.schema.alterTable('jobs', (table) => {
    table.dropColumn('veteran_or_justice');
  });

  await knex.schema.alterTable('rsp', (table) => {
    table.dropColumn('veteran_or_justice');
  });
}
