import type { Knex } from 'knex';
import config from '@two/config';

export async function up(knex: Knex) {
  // Extensions
  await Promise.all([knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto";')]);

  // UUID v7
  await knex.raw(`
    CREATE OR REPLACE FUNCTION uuid_generate_v7()
    RETURNS uuid
    AS $$
    DECLARE
      ver_rand_var bytea = e'\\\\000\\\\000\\\\000';
      unix_time_ms bytea;
      rand_bytes   bytea;
    BEGIN
      unix_time_ms = substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3);
      rand_bytes = gen_random_bytes(3);
      ver_rand_var = set_byte(ver_rand_var, 0, (b'0111'||get_byte(rand_bytes, 0)::bit(4))::bit(8)::int);
      ver_rand_var = set_byte(ver_rand_var, 1, get_byte(rand_bytes, 1));
      ver_rand_var = set_byte(ver_rand_var, 2, (b'10'||get_byte(rand_bytes, 2)::bit(6))::bit(8)::int);
      return substring((unix_time_ms || ver_rand_var || gen_random_bytes(7))::text from 3)::uuid;
    END
    $$
    LANGUAGE plpgsql
    VOLATILE;
  `);

  await Promise.all([
    knex.schema.createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
      table.text('first_name');
      table.text('last_name');
      table.text('email');
      table.text('username').notNullable().unique();
      table.text('password');
      table.specificType('roles', 'text[]').defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('apps', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
      table.text('name');
      table.uuid('user_id').index().references('users.id').onDelete('RESTRICT').onUpdate('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
  ]);

  await Promise.all([
    knex.schema.createTable('app_clients', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
      table
        .uuid('app_id')
        .notNullable()
        .index()
        .references('apps.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.text('name');
      table.text('secret');
      table.enum('grant_type', ['authorization_code', 'password']);
      table.text('redirect_uri');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    }),
    knex.schema.createTable('app_users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
      table
        .uuid('app_id')
        .notNullable()
        .index()
        .references('apps.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table
        .uuid('user_id')
        .notNullable()
        .index()
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      table.specificType('scope', 'text[]').defaultTo('{}');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
      table.unique(['app_id', 'user_id']);
    }),
  ]);

  await knex.schema.createTable('app_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v7()'));
    table
      .uuid('app_id')
      .notNullable()
      .index()
      .references('apps.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .uuid('client_id')
      .notNullable()
      .index()
      .references('app_clients.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table
      .uuid('user_id')
      .notNullable()
      .index()
      .references('users.id')
      .onDelete('CASCADE')
      .onUpdate('CASCADE');
    table.binary('token', 255).notNullable().index();
    table.boolean('self').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Functions
  await Promise.all([
    // app_token(): Add refresh token to token column
    knex.raw(`
      CREATE OR REPLACE FUNCTION app_token() RETURNS TRIGGER AS $$
      BEGIN
        -- Delete tokens older than 90 days
        EXECUTE 'DELETE FROM app_tokens WHERE app_id = $1 AND client_id = $2 AND user_id = $3 AND created_at < NOW() - INTERVAL ' || quote_literal('90 DAYS') USING NEW.app_id, NEW.client_id, NEW.user_id;
        -- Generate refresh token
        NEW.token = gen_random_bytes(32);
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `),
    // user_username(): Set username based on email address
    knex.raw(`
      CREATE OR REPLACE FUNCTION user_username() RETURNS TRIGGER AS $$
      BEGIN
        IF (TG_OP = 'INSERT') THEN
          -- Set username to lowercase email if not set
          IF (NEW.username IS NULL) THEN
            NEW.username = lower(NEW.email);
          END IF;
        ELSE
          -- Set username to lowercase email if email changed
          -- Avoid overwriting non-email username by checking if username matches old email
          IF (OLD.email <> NEW.email AND OLD.username = lower(OLD.email)) THEN
            NEW.username = lower(NEW.email);
          END IF;
        END IF;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `),
  ]);

  // Triggers
  await Promise.all([
    knex.raw(
      'CREATE TRIGGER trigger_app_tokens_token BEFORE INSERT ON app_tokens FOR EACH ROW EXECUTE PROCEDURE app_token();',
    ),
    knex.raw(
      'CREATE TRIGGER trigger_users_username BEFORE INSERT OR UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE user_username();',
    ),
  ]);

  const apps = await knex('apps').insert(
    [
      {
        name: 'TWO',
        user_id: null,
      },
    ],
    'id',
  );

  await knex('app_clients').insert([
    {
      id: config.get('clients.web.id'),
      app_id: apps[0].id,
      name: 'Web App',
      secret: config.get('clients.web.secret'),
      grant_type: 'password',
    },
  ]);

  await knex('users').insert([
    {
      first_name: 'Josh',
      last_name: 'Swan',
      email: 'josh@disruptivelabs.io',
      password: '$2b$12$zU/g7vtuUjlolqxtV6u.2eKPLUGPA9cr10SBNhnkwo.tTsRnornZa',
      roles: ['admin'],
    },
  ]);
}

export async function down(knex: Knex) {
  await Promise.all([
    knex.raw('DROP TRIGGER IF EXISTS trigger_app_tokens_token ON app_tokens'),
    knex.raw('DROP TRIGGER IF EXISTS trigger_users_username ON users'),
  ]);

  await Promise.all([
    knex.raw('DROP FUNCTION IF EXISTS app_token();'),
    knex.raw('DROP FUNCTION IF EXISTS user_username();'),
  ]);

  await Promise.all([
    knex.schema.dropTable('app_tokens'),
    knex.schema.dropTable('app_users'),
    knex.schema.dropTable('app_clients'),
    knex.schema.dropTable('apps'),
    knex.schema.dropTable('users'),
  ]);
}
