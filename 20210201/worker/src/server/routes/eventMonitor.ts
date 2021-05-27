import express, { Request, Response, Router } from 'express';
import { eventProcessor } from '../../controller/eventProcessor';

function initEventMonitorRouter(): Router {
  const router = express.Router();
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/eventMonitor', async (req: Request, res: Response) => {
    const result = await eventProcessor();
    return res.send(result);
  });

  return router;
}

export default initEventMonitorRouter;
