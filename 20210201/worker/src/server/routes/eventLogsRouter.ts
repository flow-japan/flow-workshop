import express, { Request, Response, Router } from 'express';
import { dbAccessor } from '../../modules/db/dbAccessor';

function eventLogsRouter(): Router {
  const router = express.Router();
  router.get('/event_logs', (req: Request, res: Response) => {
    const limit: number =
      typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
    const offset: number =
      typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;

    const latestEvents = dbAccessor
      .findRecentFlowEvents(limit, offset)
      .then((v) => {
        return v;
      })
      .catch((error) => console.log(error));
    res.send({ latestEvents });
    return;
  });
  return router;
}

export default eventLogsRouter;
