import { Knex } from 'knex';
import { RspClientStatus } from '@two/shared';

export async function up(knex: Knex) {
  await knex.schema.alterTable('rsp_clients', (table) => {
    table.timestamp('closed_at');
  });

  await knex('rsp_clients')
    .update('closed_at', knex.fn.now())
    .where('status', RspClientStatus.closed);
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('rsp_clients', (table) => {
    table.dropColumn('closed_at');
  });
}
