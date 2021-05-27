import { flowService } from '../modules/flow/flowAccessor';
import { RangeSettingsToFetchEvents } from '../valueObjects';

test('get latest block number', async () => {
  const height = await flowService.getLatestBlockHeight();
  console.log(height);
  expect(height).toBeGreaterThan(1);
});

test('can find an event in block range', async () => {
  const range = new RangeSettingsToFetchEvents(22358599, 22358590, 'CURSOR_ID');
  const result = await flowService.getSingleEvent(
    'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    range,
  );
  console.log('result', result);
  expect(result[0].data.itemID).toEqual(3);
});
test('can find events in block range', async () => {
  const range = new RangeSettingsToFetchEvents(22358599, 22358590, 'CURSOR_ID');
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
  expect(result[0].data.itemID).toEqual(3);
  expect(result[1].data.saleItemID).toEqual(3);
});
