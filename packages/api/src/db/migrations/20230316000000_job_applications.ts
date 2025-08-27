import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('job_applications', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('client_id')
      .notNullable()
      .index()
      .references('clients.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .uuid('job_id')
      .notNullable()
      .index()
      .references('jobs.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.text('status');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['job_id', 'client_id']);
  });
}
export async function down(knex: Knex) {
  await knex.schema.dropTable('job_applications');
}
