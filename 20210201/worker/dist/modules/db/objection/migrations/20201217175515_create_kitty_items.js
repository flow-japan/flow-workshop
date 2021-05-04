"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
async function up(knex) {
    return knex.schema.createTable('tokens', async (table) => {
        table.primary(['id', 'tokenAddress']);
        table.integer('id');
        table.integer('type');
        table.text('ownerAddress');
        table.text('tokenAddress');
        table.timestamps(true, true);
    });
}
exports.up = up;
async function down(knex) {
    return knex.schema.dropTable('tokens');
}
exports.down = down;
