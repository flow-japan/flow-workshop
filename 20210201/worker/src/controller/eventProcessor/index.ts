import { dbAccessor } from '../../modules/db/dbAccessor';
import { flowService } from '../../modules/flow/flowAccessor';
import { RangeSettingsToFetchEvents } from '../../valueObjects';
import { eventRecorder } from './eventRecorder';

//constants
const TOKEN_NAME = 'kitty_items';
const EVENT_NAMES = [
  'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
  'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
  'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
  'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
  'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
];

export async function eventProcessor(
  range: RangeSettingsToFetchEvents,
): Promise<void | string> {
  const events = await flowService.getMultipleEvents(EVENT_NAMES, range);
  if (events === []) {
    return;
  }

  for (const anEvent of events) {
    await eventRecorder(anEvent);
  }
  await updateBlockCursor(range);

  if (range.isLast) {
    return `fetched from ${range.start} to ${range.end}`;
  }
}

async function updateBlockCursor(range: RangeSettingsToFetchEvents) {
  await dbAccessor.upsertBlockCursor(range.cursorId, range.end, TOKEN_NAME);
}
