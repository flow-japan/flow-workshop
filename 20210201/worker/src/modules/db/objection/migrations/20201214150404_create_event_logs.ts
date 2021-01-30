import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw('create extension if not exists "uuid-ossp"');
  await knex.schema.createTable('flow_events', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.text('raw_event');
    table.integer('block_height');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('event_logs');
  await knex.raw('drop extension if exists "uuid-ossp"');
}
