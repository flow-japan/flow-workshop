"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const objection_1 = require("objection");
const body_parser_1 = require("body-parser");
const market_1 = __importDefault(require("./routes/market"));
const dbAccessor_1 = require("../modules/db/dbAccessor");
const eventMonitor_1 = __importDefault(require("./routes/eventMonitor"));
const V1 = '/v1/';
const dbAccessor = new dbAccessor_1.DBAccessor();
// Init all routes, setup middlewares and dependencies
const initExpress = (knex) => {
    objection_1.Model.knex(knex);
    const app = express_1.default();
    app.use(cors_1.default());
    app.use(body_parser_1.json());
    app.use(body_parser_1.urlencoded({ extended: false }));
    app.use(V1, market_1.default(dbAccessor));
    app.use(V1, eventMonitor_1.default());
    app.all('*', (req, res) => {
        res.sendStatus(404);
    });
    return app;
};
exports.default = initExpress;
