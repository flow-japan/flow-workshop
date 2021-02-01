import { flowService } from '../../modules/flow/flow';
import { dbAccessor } from '../../modules/db/dbAccessor';
import { RangeSettingsToFetchEvents } from '../../valueObjects';

import * as t from '../../types';
//constants
const eventNames = [
  'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
  'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
  'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
  'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
  'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
];

dbAccessor.init();

export async function eventFetcher(
  range: RangeSettingsToFetchEvents,
): Promise<t.Event[] | []> {
  if (range.diff < 10) {
    console.log(`skipped ${range.diff} blocks difference`);
    return [];
  }

  const events: t.Event[] = await flowService.getMultipleEvents(
    eventNames,
    range,
  );

  const eventsByTransactions = groupByTransactionId(events);

  return eventsByTransactions.flat();
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
  for (const key in result) {
    result[key] = sortByEventIndex(result[key]);
  }
  return Object.values(result);
}

type EventsByTransactions = {
  [x: string]: t.Event[];
};
