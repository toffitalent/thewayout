import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('rsp_clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('user_id')
      .notNullable()
      .index()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .uuid('rsp_id')
      .notNullable()
      .index()
      .references('rsp.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .uuid('case_manager_id')
      .index()
      .references('rsp_accounts.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.text('status');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}
export async function down(knex: Knex) {
  await knex.schema.dropTable('rsp_clients');
}
