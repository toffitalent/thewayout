import { Knex } from 'knex';
import config from '@two/config';

export async function up(knex: Knex) {
  await knex.schema.alterTable('employers', (table) => {
    table
      .integer('available_jobs_count')
      .defaultTo(config.get('subscriptionsPlans.free.jobs') as number);
    table
      .integer('available_profiles_uncloak')
      .defaultTo(config.get('subscriptionsPlans.free.uncloak') as number);
  });
}

export async function down(knex: Knex) {
  await knex.schema.alterTable('employers', (table) => {
    table.dropColumn('available_jobs_count');
    table.dropColumn('available_profiles_uncloak');
  });
}
