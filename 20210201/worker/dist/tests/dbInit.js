"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("knex"));
const knex = knex_1.default({
    client: 'postgresql',
    connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
    },
    migrations: {
        directory: './src/modules/db/objection/migrations',
    },
});
function dropTable(tableName) {
    return new Promise((resolve) => {
        knex.schema.dropTableIfExists(tableName).then((v) => resolve(v));
    });
}
function migrate() {
    return new Promise((resolve) => {
        knex.migrate.latest().then((v) => resolve(v));
    });
}
Promise.all([
    dropTable('tokens'),
    dropTable('block_cursor'),
    dropTable('knex_migrations'),
    dropTable('knex_migrations_lock'),
    dropTable('purchases'),
    dropTable('sale_offers'),
]).then((v) => migrate());
