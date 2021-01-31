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
const eventRecorder_1 = require("../worker/eventRecorder");
const fcl = __importStar(require("@onflow/fcl"));
const dbAccessor_1 = require("../modules/db/dbAccessor");
fcl.config().put('accessNode.api', process.env.FLOW_NODE);
dbAccessor_1.dbAccessor.init();
const eventRecorder = new eventRecorder_1.EventRecorder(dbAccessor_1.dbAccessor);
const SALE_OFFER_ID = Math.floor(new Date().getTime() / 1000);
const ITEM_TOKEN_ADDRESS = 'pl4032427c789f2';
const ITEM_TOKEN_NAME = 'kitty_items';
const PAYMENT_TOKEN_ADDRESS = 'fwoajiofewjao';
const PAYMENT_TOKEN_NAME = 'Kibble';
const ITEM_ID = 312;
const PRICE = '10.00';
const COLLECTION_ADDRESS = 'kk404357c789f2';
const BLOCKHEIGHT_1 = 2000049558;
const BLOCKHEIGHT_2 = 2000049622;
test('Create Event', async () => {
    await eventRecorder.process([
        {
            type: 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
            transactionId: 'bdf5f1b6f4ce5f43b97d1ca85a8d5ff85593a51e798e2c97d36eda7b42541c9d',
            transactionIndex: 1,
            eventIndex: 0,
            data: {
                id: SALE_OFFER_ID,
                itemID: 0,
                itemTokenAddress: ITEM_TOKEN_ADDRESS,
                itemTokenName: ITEM_TOKEN_NAME,
                paymentTokenAddress: PAYMENT_TOKEN_ADDRESS,
                paymentTokenName: PAYMENT_TOKEN_NAME,
                price: PRICE,
            },
            blockHeight: BLOCKHEIGHT_1,
        },
    ]);
    const saleOffer = await dbAccessor_1.dbAccessor.getSaleOffer(SALE_OFFER_ID);
    expect(saleOffer).toBeDefined();
    expect(saleOffer.paymentTokenName).toEqual('Kibble');
});
test('Accepted Event', async () => {
    await eventRecorder.process([
        {
            type: 'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
            transactionId: 'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
            transactionIndex: 1,
            eventIndex: 6,
            data: {
                id: SALE_OFFER_ID,
                itemTokenAddress: ITEM_TOKEN_ADDRESS,
                itemTokenName: ITEM_TOKEN_NAME,
                itemID: ITEM_ID,
            },
            blockHeight: BLOCKHEIGHT_2,
        },
    ]);
    const saleOffer = await dbAccessor_1.dbAccessor.getSaleOffer(SALE_OFFER_ID);
    expect(saleOffer.isFinished).toBeFalsy();
    const purchase = await dbAccessor_1.dbAccessor.findPurchaseById(SALE_OFFER_ID);
    expect(purchase).toBeDefined();
});
// test('Finish Event', async () => {
//   await eventRecorder.process([
//     {
//       type: 'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
//       transactionId:
//         'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
//       transactionIndex: 1,
//       eventIndex: 7,
//       data: {
//         id: SALE_OFFER_ID,
//         itemTokenAddress: ITEM_TOKEN_ADDRESS,
//         itemTokenName: ITEM_TOKEN_NAME,
//         itemID: ITEM_ID,
//       },
//       blockHeight: BLOCKHEIGHT_2,
//     },
//   ]);
//   const saleOffer = await dbAccessor.getSaleOffer(SALE_OFFER_ID);
//   expect(saleOffer.isFinished).toBeTruthy();
// });
test('inserted event', async () => {
    await eventRecorder.process([
        {
            type: 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
            transactionId: 'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
            transactionIndex: 1,
            eventIndex: 7,
            data: {
                saleOfferId: SALE_OFFER_ID,
                saleItemTokenAddress: ITEM_TOKEN_ADDRESS,
                saleItemTokenName: ITEM_TOKEN_NAME,
                saleItemID: ITEM_ID,
                saleItemCollection: COLLECTION_ADDRESS,
            },
            blockHeight: BLOCKHEIGHT_2,
        },
    ]);
    const saleOffer = await dbAccessor_1.dbAccessor.getSaleOffer(SALE_OFFER_ID);
    expect(saleOffer.collectionAddress).toEqual(COLLECTION_ADDRESS);
});
test('removed event', async () => {
    await eventRecorder.process([
        {
            type: 'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
            transactionId: 'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
            transactionIndex: 1,
            eventIndex: 7,
            data: {
                saleOfferId: SALE_OFFER_ID,
                saleItemTokenAddress: ITEM_TOKEN_ADDRESS,
                saleItemTokenName: ITEM_TOKEN_NAME,
                saleItemID: ITEM_ID,
                saleItemCollection: COLLECTION_ADDRESS,
            },
            blockHeight: BLOCKHEIGHT_2,
        },
    ]);
    const saleOffer = await dbAccessor_1.dbAccessor.getSaleOffer(SALE_OFFER_ID);
    expect(saleOffer.collectionAddress).toEqual('');
});
