import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tokens', async (table) => {
    table.primary(['id', 'tokenAddress']);
    table.integer('id');
    table.integer('type');
    table.text('ownerAddress');
    table.text('tokenAddress');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tokens');
}
