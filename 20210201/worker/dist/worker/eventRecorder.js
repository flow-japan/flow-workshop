"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRecorder = void 0;
class EventRecorder {
    constructor(db) {
        this.db = db;
        this.db.init();
    }
    async process(events) {
        const eventsByTransactions = groupByTransactionId(events);
        for (const events of eventsByTransactions) {
            const sortedEvents = sortByEventIndex(events);
            for (const anEvent of sortedEvents) {
                if (isCreatedEvent(anEvent)) {
                    const data = anEvent.data;
                    await this.db.insertSaleOffer(data.itemID, data.id, data.itemTokenAddress, 'kitty_market', data.price);
                }
                if (isAcceptedEvent(anEvent)) {
                    const data = anEvent.data;
                    const saleOffer = await this.db.getSaleOffer(data.id);
                    //add sellerAddress
                    await this.db.insertNewPurchase(data.id, data.itemID, saleOffer.tokenAdderss, 'buyer_address', saleOffer.collectionAddress, anEvent.transactionId, anEvent.blockHeight, saleOffer.price);
                }
                if (isFinishedEvent(anEvent)) {
                    const data = anEvent.data;
                    await this.db.finishSaleOffer(data.id);
                }
                if (isCollectionInsertedEvent(anEvent)) {
                    const data = anEvent.data;
                    await this.db.updateCollectionAddressInSaleOffer(data.saleOfferId, data.saleItemCollection);
                }
                if (isCollectionRemovedEvent(anEvent)) {
                    const data = anEvent.data;
                    await this.db.updateCollectionAddressInSaleOffer(data.saleOfferId, '');
                }
            }
        }
        function sortByHeight(events) {
            return events.sort((a, b) => a.blockHeight - b.blockHeight);
        }
        function sortByEventIndex(events) {
            return events.sort((a, b) => a.eventIndex - b.eventIndex);
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
            return (event.type ===
                'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer');
        }
        function isCollectionRemovedEvent(event) {
            return (event.type ===
                'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer');
        }
    }
}
exports.EventRecorder = EventRecorder;
