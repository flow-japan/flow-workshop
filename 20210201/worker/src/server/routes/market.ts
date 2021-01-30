import express, { Request, Response, Router } from 'express';
import { DBAccessor } from '../../modules/db/dbAccessor';

function initMarketRouter(dbAccessor: DBAccessor): Router {
  const router = express.Router();
  router.get('/market/latest', async (req: Request, res: Response) => {
    console.log('endt');
    const latestSaleOffers = await dbAccessor.findMostRecentSales();
    return res.send({
      latestSaleOffers,
    });
  });

  return router;
}

export default initMarketRouter;
