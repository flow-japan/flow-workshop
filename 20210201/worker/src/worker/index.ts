import * as fcl from '@onflow/fcl';
import { FlowService } from '../modules/flow/flow';
import { dbAccessor } from '../modules/db/dbAccessor';
import { RangeToFetchEvents } from '../valueObjects';
import { eventRecorder } from './eventRecorder';
import * as t from '../types';
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
const flowService = new FlowService();
dbAccessor.init();

export async function run() {
  const latestHeight = await flowService.getLatestBlockHeight();
  const {
    id: cursorId,
    current_block_height: cursorHeight,
  } = await dbAccessor.findLatestBlockCursor(TOKEN_NAME);
  const range = new RangeToFetchEvents(latestHeight, cursorHeight);
  console.log(range);
  if (range.diff < 10) {
    return `skipped ${range.diff} blocks difference`;
  }

  const events: t.Event[] = await flowService.getMultipleEvents(
    eventNames,
    range,
  );

  const eventsByTransactions = groupByTransactionId(events);

  for (const events of eventsByTransactions) {
    for (const event of sortByEventIndex(events)) {
      await eventRecorder(event);
    }
  }

  await dbAccessor.upsertBlockCursor(cursorId, range.end, TOKEN_NAME);

  if (range.isLast) {
    return `fetched from ${range.start} to ${range.end}`;
  }
  console.log('continue');
  await run();
}

function sortByEventIndex(events: t.Event[]): t.Event[] {
  return events.sort((a, b) => a.eventIndex - b.eventIndex);
}
function sortByHeight(events: t.Event[]): t.Event[] {
  return events.sort((a, b) => a.blockHeight - b.blockHeight);
}
function groupByTransactionId(events: t.Event[]): t.Event[][] {
  const sortedEvents = sortByHeight(events);
  const result = {} as EventsByTransactions;
  sortedEvents.forEach((x) => {
    if (!result[x.transactionId]) {
      result[x.transactionId] = [x];
    } else {
      result[x.transactionId] = [x, ...result[x.transactionId]];
    }
  });
  return Object.values(result);
}

type EventsByTransactions = {
  [x: string]: t.Event[];
};
