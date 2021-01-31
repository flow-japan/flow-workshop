import express, { Request, Response, Router } from 'express';
import { DBAccessor } from '../../modules/db/dbAccessor';

function initMarketRouter(dbAccessor: DBAccessor): Router {
  const router = express.Router();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/market/latest', async (req: Request, res: Response) => {
    const limit: number =
      typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
    const offset: number =
      typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;

    const latestSaleOffers = await dbAccessor.findMostRecentSales(
      limit,
      offset,
    );
    res.send({
      latestSaleOffers,
    });
    return;
  });
  router.get('/event_logs', async (req: Request, res: Response) => {
    const limit: number =
      typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
    const offset: number =
      typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;

    const latestEvents = await dbAccessor.findRecentFlowEvents(limit, offset);
    res.send({
      latestEvents,
    });
    return;
  });
  return router;
}

export default initMarketRouter;
