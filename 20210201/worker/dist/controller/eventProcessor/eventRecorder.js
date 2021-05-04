"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRecorder = void 0;
const dbAccessor_1 = require("../../modules/db/dbAccessor");
async function eventRecorder(event) {
    if (isCreatedEvent(event)) {
        const data = event.data;
        await dbAccessor_1.dbAccessor.insertSaleOffer(data.itemID, data.itemTokenName, data.id, data.itemTokenAddress, data.paymentTokenAddress, data.paymentTokenName, 'kitty_market', data.price);
    }
    if (isAcceptedEvent(event)) {
        const data = event.data;
        const saleOffer = await dbAccessor_1.dbAccessor.getSaleOffer(data.id);
        //add sellerAddress
        await dbAccessor_1.dbAccessor.insertNewPurchase(data.id, data.itemID, saleOffer.tokenAddress, 'buyer_address', saleOffer.collectionAddress, event.transactionId, event.blockHeight, saleOffer.price);
    }
    if (isFinishedEvent(event)) {
        const data = event.data;
        await dbAccessor_1.dbAccessor.finishSaleOffer(data.id);
    }
    if (isCollectionInsertedEvent(event)) {
        const data = event.data;
        await dbAccessor_1.dbAccessor.updateCollectionAddressInSaleOffer(data.saleOfferId, data.saleItemCollection);
    }
    if (isCollectionRemovedEvent(event)) {
        const data = event.data;
        await dbAccessor_1.dbAccessor.updateCollectionAddressInSaleOffer(data.saleOfferId, '');
    }
    await dbAccessor_1.dbAccessor.insertFlowEvent(JSON.stringify(event), event.blockHeight);
}
exports.eventRecorder = eventRecorder;
function sortByEventIndex(events) {
    return events.sort((a, b) => a.eventIndex - b.eventIndex);
}
function sortByHeight(events) {
    return events.sort((a, b) => a.blockHeight - b.blockHeight);
}
function groupByTransactionId(events) {
    const sortedEvents = sortByHeight(events);
    const result = {};
    sortedEvents.forEach((x) => {
        if (!result[x.transactionId]) {
            result[x.transactionId] = [x];
        }
        else {
            result[x.transactionId] = [x, ...result[x.transactionId]];
        }
    });
    return Object.values(result);
}
function isCreatedEvent(event) {
    return event.type === 'A.fc40912427c789d2.SampleMarket.SaleOfferCreated';
}
function isFinishedEvent(event) {
    return event.type === 'A.fc40912427c789d2.SampleMarket.SaleOfferFinished';
}
function isAcceptedEvent(event) {
    return event.type === 'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted';
}
function isCollectionInsertedEvent(event) {
    return (event.type === 'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer');
}
function isCollectionRemovedEvent(event) {
    return (event.type === 'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer');
}
