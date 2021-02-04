import express, { Request, Response, Router } from 'express';
import { dbAccessor } from '../../modules/db/dbAccessor';

function initMarketRouter(): Router {
  const router = express.Router();
  router.get('/sales', (req: Request, res: Response) => {
    const limit: number =
      typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
    const offset: number =
      typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;

    const latestSaleOffers = dbAccessor
      .findMostRecentSales(limit, offset)
      .then((v) => {
        return v;
      })
      .catch((error) => console.error(error));
    res.send({
      latestSaleOffers,
    });
    return;
  });
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

export default initMarketRouter;
