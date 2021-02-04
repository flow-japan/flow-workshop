import { eventFetcher } from '../controller/eventProcessor/eventFetcher';
import { dbAccessor } from '../modules/db/dbAccessor';
import { RangeSettingsToFetchEvents } from '../valueObjects';

const EVENT_NAMES = [
  'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
  'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
  'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
  'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
  'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
];
test('correct order.', async () => {
  const range = new RangeSettingsToFetchEvents(2300000, 2235800, '');
  const result = await eventFetcher(EVENT_NAMES, range);
  expect(result).toBeDefined();
});
