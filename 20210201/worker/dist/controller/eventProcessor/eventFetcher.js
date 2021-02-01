"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventFetcher = void 0;
const flow_1 = require("../../modules/flow/flow");
const dbAccessor_1 = require("../../modules/db/dbAccessor");
//constants
const eventNames = [
    'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
    'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
    'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
    'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
    'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
];
dbAccessor_1.dbAccessor.init();
async function eventFetcher(range) {
    if (range.diff < 10) {
        console.log(`skipped ${range.diff} blocks difference`);
        return [];
    }
    const events = await flow_1.flowService.getMultipleEvents(eventNames, range);
    const eventsByTransactions = groupByTransactionId(events);
    return eventsByTransactions.flat();
}
exports.eventFetcher = eventFetcher;
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
    for (const key in result) {
        result[key] = sortByEventIndex(result[key]);
    }
    return Object.values(result);
}
