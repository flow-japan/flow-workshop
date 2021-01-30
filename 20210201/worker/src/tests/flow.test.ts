import { FlowService } from '../modules/flow/flow';
import * as fcl from '../../node_modules/@onflow/fcl';
import { BlockRange } from '../valueObjects';

fcl.config().put('accessNode.api', process.env.FLOW_NODE);
const flowService = new FlowService();

test('get latest block number', async () => {
  const height = await flowService.getLatestBlockHeight();
  console.log(height);
  expect(height).toBeGreaterThan(1);
});

test('can find an event in block range', async () => {
  const range = new BlockRange(20078500, 20079500);
  const result = await flowService.getSingleEvent(
    'A.fcceff21d9532b58.KittyItemsMarket.SaleOfferCreated',
    range,
  );
  expect(result[0].data.itemID).toEqual(81);
});
test('can find events in block range', async () => {
  const range = new BlockRange(21570315, 21570322);
  const result = await flowService.getMultipleEvents(
    [
      'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
      'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
      'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
      'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
      'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
    ],
    range,
  );
  console.log(result);
  expect(result[0].data.itemID).toEqual(81);
  expect(result[1].data.saleItemID).toEqual(81);
});
