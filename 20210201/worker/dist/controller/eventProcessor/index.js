"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventProcessor = void 0;
const dbAccessor_1 = require("../../modules/db/dbAccessor");
const flow_1 = require("../../modules/flow/flow");
const valueObjects_1 = require("../../valueObjects");
const eventFetcher_1 = require("./eventFetcher");
const eventRecorder_1 = require("./eventRecorder");
//constants
const TOKEN_NAME = 'kitty_items';
async function eventProcessor() {
    const range = await generateRangeSettings();
    const events = await eventFetcher_1.eventFetcher(range);
    for (const anEvent of events) {
        await eventRecorder_1.eventRecorder(anEvent);
    }
    await updateBlockCursor(range);
    if (range.isLast) {
        return `fetched from ${range.start} to ${range.end}`;
    }
    console.log('start fetching next Block Range.');
    await eventProcessor();
}
exports.eventProcessor = eventProcessor;
async function generateRangeSettings() {
    const latestHeight = await flow_1.flowService.getLatestBlockHeight();
    const { id: cursorId, current_block_height: cursorHeight, } = await dbAccessor_1.dbAccessor.findLatestBlockCursor(TOKEN_NAME);
    return new valueObjects_1.RangeSettingsToFetchEvents(latestHeight, cursorHeight, cursorId);
}
async function updateBlockCursor(range) {
    await dbAccessor_1.dbAccessor.upsertBlockCursor(range.cursorId, range.end, TOKEN_NAME);
}
