import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('purchases', (table) => {
    table.primary(['saleOfferId']);
    table.text('buyerAddress');
    table.text('sellerAddress');
    table.text('txHash');
    table.integer('blockHeight');
    table.integer('tokenId');
    table.integer('saleOfferId');
    table.text('tokenAddress');
    table.text('price');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('purchases');
}
