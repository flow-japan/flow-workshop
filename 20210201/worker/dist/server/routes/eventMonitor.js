"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const eventProcessor_1 = require("../../controller/eventProcessor");
function initEventMonitorRouter() {
    const router = express_1.default.Router();
    console.log('event start');
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    router.get('/eventMonitor', async (req, res) => {
        const result = await eventProcessor_1.eventProcessor();
        return res.send(result);
    });
    return router;
}
exports.default = initEventMonitorRouter;
