import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('rsp', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table.text('name').unique();
    table.text('description');
    table.text('address');
    table.text('city');
    table.text('state');
    table.text('postal_code');
    table.text('phone');
    table.text('email');
    table.text('avatar');
    table.specificType('services_area', 'text[]');
    table.specificType('support', 'text[]');
    table.specificType('justice_status', 'text[]');
    table.specificType('offenses', 'text[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.createTable('rsp_accounts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('user_id')
      .notNullable()
      .index()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .unique();
    table.uuid('rsp_id').index().references('rsp.id').onDelete('CASCADE').onUpdate('CASCADE');
    table.text('position');
    table.text('role');
    table.boolean('is_profile_filled').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable('users', (table) => {
    table.text('phone');
    table.text('avatar');
  });
}
export async function down(knex: Knex) {
  await knex.schema.dropTable('rsp_accounts');
  await knex.schema.dropTable('rsp');
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('phone');
    table.dropColumn('avatar');
  });
}
