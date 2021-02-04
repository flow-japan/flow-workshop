import { dbAccessor } from '../../modules/db/dbAccessor';
import * as t from '../../types';

async function eventRecorder(event: t.Event): Promise<void> {
  if (isCreatedEvent(event)) {
    const data = event.data as t.SaleOfferCreatedEventData;
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

  if (isAcceptedEvent(event)) {
    const data = event.data as t.SaleOfferAcceptedEventData;
    const saleOffer = await dbAccessor.getSaleOffer(data.id);
    //add sellerAddress
    await dbAccessor.insertNewPurchase(
      data.id,
      data.itemID,
      saleOffer.tokenAddress,
      'buyer_address',
      saleOffer.collectionAddress,
      event.transactionId,
      event.blockHeight,
      saleOffer.price,
    );
  }

  if (isFinishedEvent(event)) {
    const data = event.data as t.SaleOfferFinishedEventData;
    await dbAccessor.finishSaleOffer(data.id);
  }

  if (isCollectionInsertedEvent(event)) {
    const data = event.data as t.CollectionInsertedSaleOffer;
    await dbAccessor.updateCollectionAddressInSaleOffer(
      data.saleOfferId,
      data.saleItemCollection,
    );
  }

  if (isCollectionRemovedEvent(event)) {
    const data = event.data as t.CollectionInsertedSaleOffer;
    await dbAccessor.updateCollectionAddressInSaleOffer(data.saleOfferId, '');
  }
  await dbAccessor.insertFlowEvent(JSON.stringify(event), event.blockHeight);
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
