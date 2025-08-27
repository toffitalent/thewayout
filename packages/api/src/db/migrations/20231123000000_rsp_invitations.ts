import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('rsp_invitations', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('rsp_id')
      .notNullable()
      .index()
      .references('rsp.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.text('first_name');
    table.text('last_name');
    table.text('phone');
    table.text('email');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.unique(['rsp_id', 'email']);
  });
}
export async function down(knex: Knex) {
  await knex.schema.dropTable('rsp_invitations');
}
