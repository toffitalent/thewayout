import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('clients', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('user_id')
      .notNullable()
      .index()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE')
      .unique();
    table.text('first_name');
    table.text('last_name');
    table.text('justice_status');
    table.text('phone');
    table.text('address');
    table.text('city');
    table.text('state');
    table.text('postal_code');

    table.specificType('support', 'text[]');
    table.text('reentry_service_provider');
    table.text('reentry_pipeline');

    table.text('gender');
    table.text('orientation');
    table.text('religion');
    table.text('marital_status');
    table.text('age');
    table.boolean('disability');
    table.text('ethnicity');
    table.text('veteran_status');

    table.text('referred_by');
    table.specificType('personal_strengths', 'text[]');
    table.specificType('experience', 'text[]');
    table.specificType('languages', 'jsonb[]');

    table.specificType('offense', 'text[]');

    table.boolean('sexual_offender_registry');
    table.boolean('sbn');
    table.text('time_served');
    table.text('released_at');
    table.text('state_or_federal');
    table.text('probation_or_parole');

    table.specificType('relative_experience', 'jsonb[]');
    table.text('personal_summary');
    table.specificType('education', 'jsonb[]');
    table.specificType('license', 'jsonb[]');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('clients');
}
