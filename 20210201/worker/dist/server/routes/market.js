"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
function initMarketRouter(dbAccessor) {
    const router = express_1.default.Router();
    router.get('/market/latest', async (req, res) => {
        console.log('endt');
        const latestSaleOffers = await dbAccessor.findMostRecentSales();
        return res.send({
            latestSaleOffers,
        });
    });
    return router;
}
exports.default = initMarketRouter;
