import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('employers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('user_id')
      .notNullable()
      .index()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .unique();
    table.text('name');
    table.text('industry');
    table.text('description');
    table.text('years_in_business');
    table.text('number_of_employees');
    table.text('address');
    table.text('city');
    table.text('state');
    table.text('postal_code');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}
export async function down(knex: Knex) {
  await knex.schema.dropTable('employers');
}
