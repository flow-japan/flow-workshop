"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
function initMarketRouter(dbAccessor) {
    const router = express_1.default.Router();
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.get('/market/latest', async (req, res) => {
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
        const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;
        const latestSaleOffers = await dbAccessor.findMostRecentSales(limit, offset);
        res.send({
            latestSaleOffers,
        });
        return;
    });
    router.get('/event_logs', async (req, res) => {
        const limit = typeof req.query.limit === 'string' ? parseInt(req.query.limit) : 20;
        const offset = typeof req.query.offset === 'string' ? parseInt(req.query.offset) : 0;
        const latestEvents = await dbAccessor.findRecentFlowEvents(limit, offset);
        res.send({
            latestEvents,
        });
        return;
    });
    return router;
}
exports.default = initMarketRouter;
