"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fcl = __importStar(require("../../node_modules/@onflow/fcl"));
const initExpress_1 = __importDefault(require("./initExpress"));
const knex_1 = __importDefault(require("knex"));
async function run() {
    const knexInstance = knex_1.default({
        client: 'postgresql',
        connection: {
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            host: process.env.DB_HOST,
        },
        migrations: {
            directory: process.env.MIGRATION_PATH || './src/modules/db/objection/migrations',
        },
    });
    // Make sure to disconnect from DB when exiting the process
    process.on('SIGTERM', () => {
        knexInstance.destroy().then(() => {
            process.exit(0);
        });
    });
    await knexInstance.migrate.latest();
    fcl.config().put('accessNode.api', process.env.FLOW_NODE);
    const app = initExpress_1.default(knexInstance);
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    });
}
run().catch((e) => {
    console.error('error', e);
    process.exit(1);
});
