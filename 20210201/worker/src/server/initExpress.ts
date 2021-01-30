import 'express-async-errors';
import express, { Request, Response, Express } from 'express';
import Knex from 'knex';
import cors from 'cors';
import { Model } from 'objection';
import { json, urlencoded } from 'body-parser';
import initMarketRouter from './routes/market';
import { DBAccessor } from '../modules/db/dbAccessor';
import initEventMonitorRouter from './routes/eventMonitor';

const V1 = '/v1/';
const dbAccessor = new DBAccessor();
// Init all routes, setup middlewares and dependencies
const initExpress = (knex: Knex): Express => {
  Model.knex(knex);
  const app = express();

  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initMarketRouter(dbAccessor));
  app.use(V1, initEventMonitorRouter());
  app.all('*', (req: Request, res: Response) => {
    res.sendStatus(404);
  });

  return app;
};

export default initExpress;
