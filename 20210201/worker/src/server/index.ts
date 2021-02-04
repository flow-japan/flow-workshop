import 'express-async-errors';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
// import initEventMonitorRouter from './routes/eventMonitor';
import salesRouter from './routes/salesRouter';
import eventLogsRouter from './routes/eventLogsRouter';

const V1 = '/v1/';

function run() {
  const app = express();
  app.use(cors());
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(V1, salesRouter());
  app.use(V1, eventLogsRouter());
  // app.use(V1, initEventMonitorRouter());
  app.all('*', (req: Request, res: Response) => {
    res.sendStatus(404);
  });
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`);
  });
}

run();
