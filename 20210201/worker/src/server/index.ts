import 'express-async-errors';
import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import initMarketRouter from './routes/market';
import initEventMonitorRouter from './routes/eventMonitor';

const V1 = '/v1/';

function run() {
  const app = initExpress();
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
}

function initExpress(): Express {
  const app = express();

  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, initMarketRouter());
  app.use(V1, initEventMonitorRouter());
  app.all('*', (req: Request, res: Response) => {
    res.sendStatus(404);
  });

  return app;
}

run();
