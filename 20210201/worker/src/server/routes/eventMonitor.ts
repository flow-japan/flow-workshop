import express, { Request, Response, Router } from 'express';
import { run } from '../../worker';

function initEventMonitorRouter(): Router {
  const router = express.Router();
  console.log('event start');
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get('/eventMonitor', async (req: Request, res: Response) => {
    const result = await run();
    return res.send(result);
  });

  return router;
}

export default initEventMonitorRouter;
