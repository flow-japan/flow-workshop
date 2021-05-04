import { eventSorter } from '../controller/eventProcessor/eventSorter';

const events = [
  {
    type: 'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
    transactionId:
      'b3b36a1b41986cccccc66175901615318ccb526f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 1,
    data: {
      saleOfferId: 12,
      saleItemTokenAddress: 'a',
      saleItemTokenName: 'ITEM_TOKEN_NAME',
      saleItemID: 0,
      saleItemCollection: 'COLLECTION_ADDRESS',
    },
    blockHeight: 1234569,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
    transactionId: 'b3b36a1b419865e0238d01615f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 1,
    data: {
      saleOfferId: 12,
      saleItemTokenAddress: 'b',
      saleItemTokenName: 'ITEM_TOKEN_NAME',
      saleItemID: 3,
      saleItemCollection: 'COLLECTION_ADDRESS',
    },
    blockHeight: 123456,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
    transactionId: 'b3b36a1b419865cfb66175901615318ccb526f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 1,
    data: {
      saleOfferId: 13,
      saleItemTokenAddress: 'c',
      saleItemTokenName: 'ITEM_TOKEN_NAME',
      saleItemID: 3,
      saleItemCollection: 'COLLECTION_ADDRESS',
    },
    blockHeight: 1234560,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
    transactionId:
      'b3b36a1b41986cccccc66175901615318ccb526f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 0,
    data: {
      id: 12,
      itemTokenAddress: 'd',
      itemTokenName: 'ITEM_TOKEN_NAME',
      itemID: 3,
    },
    blockHeight: 1234569,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
    transactionId: 'b3b36a1b419865e0238dcfb66175901615326f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 1,
    data: {
      saleOfferId: 14,
      saleItemTokenAddress: 'e',
      saleItemTokenName: 'ITEM_TOKEN_NAME',
      saleItemID: 3,
      saleItemCollection: 'COLLECTION_ADDRESS',
    },
    blockHeight: 12345600,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
    transactionId:
      'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 1,
    data: {
      saleOfferId: 15,
      saleItemTokenAddress: 'f',
      saleItemTokenName: 'ITEM_TOKEN_NAME',
      saleItemID: 3,
      saleItemCollection: 'COLLECTION_ADDRESS',
    },
    blockHeight: 123456000,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    transactionId:
      'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 0,
    data: {
      id: 12,
      itemID: 0,
      itemTokenAddress: 'g',
      itemTokenName: 'ITEM_TOKEN_NAME',
      paymentTokenAddress: 'PAYMENT_TOKEN_ADDRESS',
      paymentTokenName: 'PAYMENT_TOKEN_NAME',
      price: 'PRICE',
    },
    blockHeight: 123456000,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    transactionId: 'b3b36a1b419865cfb66175901615318ccb526f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 0,
    data: {
      id: 13,
      itemID: 0,
      itemTokenAddress: 'h',
      itemTokenName: 'ITEM_TOKEN_NAME',
      paymentTokenAddress: 'PAYMENT_TOKEN_ADDRESS',
      paymentTokenName: 'PAYMENT_TOKEN_NAME',
      price: '1234560',
    },
    blockHeight: 1234560,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    transactionId: 'b3b36a1b419865e0238dcfb66175901615326f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 0,
    data: {
      id: 14,
      itemID: 0,
      itemTokenAddress: 'i',
      itemTokenName: 'ITEM_TOKEN_NAME',
      paymentTokenAddress: 'PAYMENT_TOKEN_ADDRESS',
      paymentTokenName: 'PAYMENT_TOKEN_NAME',
      price: 'PRICE',
    },
    blockHeight: 12345600,
  },
  {
    type: 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    transactionId: 'b3b36a1b419865e0238d01615f48a8711997bbdf27bbaf',
    transactionIndex: 1,
    eventIndex: 0,
    data: {
      id: 15,
      itemID: 0,
      itemTokenAddress: 'j',
      itemTokenName: 'ITEM_TOKEN_NAME',
      paymentTokenAddress: 'PAYMENT_TOKEN_ADDRESS',
      paymentTokenName: 'PAYMENT_TOKEN_NAME',
      price: 'PRICE',
    },
    blockHeight: 123456,
  },
];

test('correct order.', () => {
  const organized = eventSorter(events);
  expect(organized[0].data.itemTokenAddress).toEqual('j');
  expect(organized[1].data.saleItemTokenAddress).toEqual('b');
  expect(organized[2].data.itemTokenAddress).toEqual('h');
  expect(organized[3].data.saleItemTokenAddress).toEqual('c');
  expect(organized[4].data.itemTokenAddress).toEqual('d');
  expect(organized[5].data.saleItemTokenAddress).toEqual('a');
  expect(organized[6].data.itemTokenAddress).toEqual('i');
  expect(organized[7].data.saleItemTokenAddress).toEqual('e');
});
