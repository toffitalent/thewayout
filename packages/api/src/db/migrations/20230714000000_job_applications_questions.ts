import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.alterTable('job_applications', (table) => {
    table.specificType('questions', 'jsonb[]');
  });
}
export async function down(knex: Knex) {
  await knex.schema.alterTable('job_applications', (table) => {
    table.dropColumn('questions');
  });
}
