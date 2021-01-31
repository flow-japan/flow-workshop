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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const flow_1 = require("../modules/flow/flow");
const fcl = __importStar(require("../../node_modules/@onflow/fcl"));
const valueObjects_1 = require("../valueObjects");
fcl.config().put('accessNode.api', process.env.FLOW_NODE);
const flowService = new flow_1.FlowService();
test('get latest block number', async () => {
    const height = await flowService.getLatestBlockHeight();
    console.log(height);
    expect(height).toBeGreaterThan(1);
});
test('can find an event in block range', async () => {
    const range = new valueObjects_1.BlockRange(20078500, 20079500);
    const result = await flowService.getSingleEvent('A.fcceff21d9532b58.KittyItemsMarket.SaleOfferCreated', range);
    expect(result[0].data.itemID).toEqual(81);
});
test('can find events in block range', async () => {
    const range = new valueObjects_1.BlockRange(21570315, 21570322);
    const result = await flowService.getMultipleEvents([
        'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
        'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
        'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
        'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
        'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
    ], range);
    console.log(result);
    expect(result[0].data.itemID).toEqual(81);
    expect(result[1].data.saleItemID).toEqual(81);
});
