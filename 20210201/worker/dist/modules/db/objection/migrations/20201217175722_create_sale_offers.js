"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
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
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('sale_offers');
}
exports.down = down;
