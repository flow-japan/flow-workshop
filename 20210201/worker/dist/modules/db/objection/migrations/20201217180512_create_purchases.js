"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
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
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('purchases');
}
exports.down = down;
