import { dbAccessor, DBAccessor } from '../modules/db/dbAccessor';
import * as t from '../types';

type EventsByTransactions = {
  [x: string]: t.Event[];
};

async function eventRecorder(events: t.Event[]): Promise<void> {
  dbAccessor.init();

  const eventsByTransactions = groupByTransactionId(events);

  for (const events of eventsByTransactions) {
    const sortedEvents = sortByEventIndex(events);

    for (const anEvent of sortedEvents) {
      if (isCreatedEvent(anEvent)) {
        const data = anEvent.data as t.SaleOfferCreatedEventData;
        await dbAccessor.insertSaleOffer(
          data.itemID,
          data.itemTokenName,
          data.id,
          data.itemTokenAddress,
          data.paymentTokenAddress,
          data.paymentTokenName,
          'kitty_market',
          data.price,
        );
      }

      if (isAcceptedEvent(anEvent)) {
        const data = anEvent.data as t.SaleOfferAcceptedEventData;
        const saleOffer = await dbAccessor.getSaleOffer(data.id);
        //add sellerAddress
        await dbAccessor.insertNewPurchase(
          data.id,
          data.itemID,
          saleOffer.tokenAddress,
          'buyer_address',
          saleOffer.collectionAddress,
          anEvent.transactionId,
          anEvent.blockHeight,
          saleOffer.price,
        );
      }

      if (isFinishedEvent(anEvent)) {
        const data = anEvent.data as t.SaleOfferFinishedEventData;
        await dbAccessor.finishSaleOffer(data.id);
      }

      if (isCollectionInsertedEvent(anEvent)) {
        const data = anEvent.data as t.CollectionInsertedSaleOffer;
        await dbAccessor.updateCollectionAddressInSaleOffer(
          data.saleOfferId,
          data.saleItemCollection,
        );
      }

      if (isCollectionRemovedEvent(anEvent)) {
        const data = anEvent.data as t.CollectionInsertedSaleOffer;
        await dbAccessor.updateCollectionAddressInSaleOffer(
          data.saleOfferId,
          '',
        );
      }
      await dbAccessor.insertFlowEvent(
        JSON.stringify(anEvent),
        anEvent.blockHeight,
      );
    }
  }
}
function sortByHeight(events: t.Event[]): t.Event[] {
  return events.sort((a, b) => a.blockHeight - b.blockHeight);
}

function sortByEventIndex(events: t.Event[]): t.Event[] {
  return events.sort((a, b) => a.eventIndex - b.eventIndex);
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

function isCreatedEvent(event: t.Event): boolean {
  return event.type === 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated';
}
function isFinishedEvent(event: t.Event): boolean {
  return event.type === 'A.fc40912427c789d2.SampleMarket.SaleOfferFinished';
}
function isAcceptedEvent(event: t.Event): boolean {
  return event.type === 'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted';
}
function isCollectionInsertedEvent(event: t.Event): boolean {
  return (
    event.type === 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer'
  );
}
function isCollectionRemovedEvent(event: t.Event) {
  return (
    event.type === 'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer'
  );
}

export { eventRecorder };
