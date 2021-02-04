import { dbAccessor } from '../../modules/db/dbAccessor';
import { flowService } from '../../modules/flow/flow';
import { RangeSettingsToFetchEvents } from '../../valueObjects';
import { eventFetcher } from './eventFetcher';
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

export async function eventProcessor() {
  const range = await generateRangeSettings();
  const events = await eventFetcher(EVENT_NAMES, range);
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
  console.log('start fetching next Block Range.');
  await eventProcessor();
}

async function generateRangeSettings() {
  const latestHeight = await flowService.getLatestBlockHeight();
  const {
    id: cursorId,
    current_block_height: cursorHeight,
  } = await dbAccessor.findLatestBlockCursor(TOKEN_NAME);
  return new RangeSettingsToFetchEvents(latestHeight, cursorHeight, cursorId);
}

async function updateBlockCursor(range: RangeSettingsToFetchEvents) {
  await dbAccessor.upsertBlockCursor(range.cursorId, range.end, TOKEN_NAME);
}
