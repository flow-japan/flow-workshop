import { eventRecorder } from '../controller/eventProcessor/eventRecorder';
import * as fcl from '@onflow/fcl';
import { dbAccessor } from '../modules/db/dbAccessor';

fcl.config().put('accessNode.api', process.env.FLOW_NODE);
dbAccessor.init();

const SALE_OFFER_ID: number = Math.floor(new Date().getTime() / 1000);
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
  await eventRecorder({
    type: 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    transactionId:
      'bdf5f1b6f4ce5f43b97d1ca85a8d5ff85593a51e798e2c97d36eda7b42541c9d',
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
  });
  const saleOffer = await dbAccessor.getSaleOffer(SALE_OFFER_ID);
  expect(saleOffer).toBeDefined();
  expect(saleOffer.paymentTokenName).toEqual('Kibble');
});

test('Accepted Event', async () => {
  await eventRecorder({
    type: 'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
    transactionId:
      'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 6,
    data: {
      id: SALE_OFFER_ID,
      itemTokenAddress: ITEM_TOKEN_ADDRESS,
      itemTokenName: ITEM_TOKEN_NAME,
      itemID: ITEM_ID,
    },
    blockHeight: BLOCKHEIGHT_2,
  });
  const saleOffer = await dbAccessor.getSaleOffer(SALE_OFFER_ID);
  expect(saleOffer.isFinished).toBeFalsy();
  const purchase = await dbAccessor.findPurchaseById(SALE_OFFER_ID);
  expect(purchase).toBeDefined();
});

// test('Finish Event', async () => {
//   await eventRecorder([
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
  await eventRecorder({
    type: 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
    transactionId:
      'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
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
  });
  const saleOffer = await dbAccessor.getSaleOffer(SALE_OFFER_ID);
  expect(saleOffer.collectionAddress).toEqual(COLLECTION_ADDRESS);
});
test('removed event', async () => {
  await eventRecorder({
    type: 'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
    transactionId:
      'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
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
  });
  const saleOffer = await dbAccessor.getSaleOffer(SALE_OFFER_ID);
  expect(saleOffer.collectionAddress).toEqual('');
});
