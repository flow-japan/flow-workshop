"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const fcl = __importStar(require("@onflow/fcl"));
const flow_1 = require("../modules/flow/flow");
const dbAccessor_1 = require("../modules/db/dbAccessor");
const valueObjects_1 = require("../valueObjects");
const eventRecorder_1 = require("./eventRecorder");
//constants
const eventNames = [
    'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
    'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
    'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
    'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
];
const TOKEN_NAME = 'kitty_items';
fcl.config().put('accessNode.api', process.env.FLOW_NODE);
const flowService = new flow_1.FlowService();
dbAccessor_1.dbAccessor.init();
const eventRecorder = new eventRecorder_1.EventRecorder(dbAccessor_1.dbAccessor);
async function run() {
    const latestHeight = await flowService.getLatestBlockHeight();
    const blockCursorDBModel = await dbAccessor_1.dbAccessor.findLatestBlockCursor(TOKEN_NAME);
    const cursorHeight = blockCursorDBModel
        ? blockCursorDBModel.current_block_height
        : 0;
    const range = calculateBlockRange(latestHeight, cursorHeight);
    if (range.diff < 50) {
        return;
    }
    const events = await flowService.getMultipleEvents(eventNames, range);
    console.log(events);
    await eventRecorder.process(events);
    const cursorId = blockCursorDBModel
        ? blockCursorDBModel.id
        : undefined;
    await dbAccessor_1.dbAccessor.upsertBlockCursor(cursorId, range.end, TOKEN_NAME);
    return events;
}
exports.run = run;
function calculateBlockRange(latestHeight, cursorHeight) {
    if (cursorHeight === 0) {
        return new valueObjects_1.BlockRange(latestHeight - 100, latestHeight);
    }
    if (cursorHeight + 1000 > latestHeight) {
        return new valueObjects_1.BlockRange(cursorHeight, latestHeight);
    }
    else {
        return new valueObjects_1.BlockRange(cursorHeight, cursorHeight + 1000);
    }
}
