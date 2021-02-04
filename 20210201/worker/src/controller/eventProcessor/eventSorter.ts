import * as t from '../../types';
//constants

export function eventSorter(events: t.Event[]): t.Event[] {
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
