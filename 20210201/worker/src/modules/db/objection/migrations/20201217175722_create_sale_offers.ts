import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('sale_offers', (table) => {
    table.primary(['saleOfferId']);
    table.text('price');
    table.text('sellerAddress');
    table.text('collectionAddress');
    table.text('txHash');
    table.boolean('isFinished');
    table.text('marketAddress');
    table.text('tokenAddress');
    table.integer('tokenId');
    table.integer('saleOfferId');
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('sale_offers');
}
