import * as t from '../../types';
//constants

export function eventSorter(events: t.Event[]): t.Event[] {
  const sortedEvents = sortByHeight(events);
  const groupedEvents = {} as EventsByTransactions;
  sortedEvents.forEach((x) => {
    if (!groupedEvents[x.transactionId]) {
      groupedEvents[x.transactionId] = [x];
    } else {
      groupedEvents[x.transactionId] = [x, ...groupedEvents[x.transactionId]];
    }
  });
  for (const key in groupedEvents) {
    groupedEvents[key] = sortByEventIndex(groupedEvents[key]);
  }
  return Object.values(groupedEvents).flat();
}

function sortByEventIndex(events: t.Event[]): t.Event[] {
  return events.sort((a, b) => a.eventIndex - b.eventIndex);
}
function sortByHeight(events: t.Event[]): t.Event[] {
  return events.sort((a, b) => a.blockHeight - b.blockHeight);
}

type EventsByTransactions = {
  [x: string]: t.Event[];
};
