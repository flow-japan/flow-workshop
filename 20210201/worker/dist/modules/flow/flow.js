"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowService = void 0;
const fcl = __importStar(require("@onflow/fcl"));
const sdk_latest_block_1 = require("@onflow/sdk-latest-block");
const sdk_send_1 = require("@onflow/sdk-send");
const sdk_build_get_events_1 = require("@onflow/sdk-build-get-events");
class FlowService {
    constructor() {
        this.getAccount = async (addr) => {
            const { account } = await fcl.send([fcl.getAccount(addr)]);
            return account;
        };
    }
    async getLatestBlockHeight() {
        const blockHeight = await sdk_latest_block_1.latestBlock();
        return blockHeight.height;
    }
    async getSingleEvent(eventName, range) {
        try {
            const rawResult = await sdk_send_1.send([
                sdk_build_get_events_1.getEvents(eventName, range.start, range.end),
            ]);
            const blockHeights = rawResult.events.map((x) => x.blockHeight);
            const result = await fcl.decode(rawResult);
            return result.map((v, i) => ({
                ...v,
                blockHeight: blockHeights[i],
            }));
        }
        catch (e) {
            console.error(`error retrieving events for block range fromBlock=${range.start} toBlock=${range.end}`, e);
        }
    }
    async getMultipleEvents(eventNames, range) {
        const events = await Promise.all(eventNames.map((name) => this.getSingleEvent(name, range)));
        return [].concat(...events);
    }
}
exports.FlowService = FlowService;
