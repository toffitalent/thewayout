import { Knex } from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('jobs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('employer_id')
      .notNullable()
      .index()
      .references('employers.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.text('title');
    table.text('description');
    table.text('department');
    table.text('start_date');
    table.text('type_of_work');
    table.text('working_time');
    table.integer('number_of_open_positions');
    table.jsonb('location');
    table.specificType('offenses', 'text[]');
    table.specificType('responsibilities', 'text[]');
    table.text('experience');
    table.text('skills_description');
    table.jsonb('salary_options');
    table.specificType('questions', 'text[]');
    table.text('status');

    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}
export async function down(knex: Knex) {
  await knex.schema.dropTable('jobs');
}
