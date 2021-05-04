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
exports.KittyItemsService = void 0;
const t = __importStar(require("@onflow/types"));
const fcl = __importStar(require("../../worker/node_modules/@onflow/fcl"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class KittyItemsService {
    constructor(flowService, nonFungibleTokenAddress, kittyItemsAddress) {
        this.flowService = flowService;
        this.nonFungibleTokenAddress = nonFungibleTokenAddress;
        this.kittyItemsAddress = kittyItemsAddress;
        this.setupAccount = async () => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(process.env.CADENCE_PATH || __dirname, `../../cadence/kittyItems/transactions/setup_account.cdc`), 'utf8')
                .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
                .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
            return this.flowService.sendTx({
                transaction,
                args: [],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.mint = async (recipient, typeId) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(process.env.CADENCE_PATH || __dirname, `../../cadence/kittyItems/transactions/mint_kitty_item.cdc`), 'utf8')
                .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
                .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
            return this.flowService.sendTx({
                transaction,
                args: [fcl.arg(recipient, t.Address), fcl.arg(typeId, t.UInt64)],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.transfer = async (recipient, itemId) => {
            const authorization = this.flowService.authorizeMinter();
            const transaction = fs
                .readFileSync(path.join(process.env.CADENCE_PATH || __dirname, `../../cadence/kittyItems/transactions/transfer_kitty_item.cdc`), 'utf8')
                .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
                .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
            return this.flowService.sendTx({
                transaction,
                args: [fcl.arg(recipient, t.Address), fcl.arg(itemId, t.UInt64)],
                authorizations: [authorization],
                payer: authorization,
                proposer: authorization,
            });
        };
        this.getCollectionIds = async (account) => {
            const script = fs
                .readFileSync(path.join(process.env.CADENCE_PATH || __dirname, `../../cadence/kittyItems/scripts/read_collection_ids.cdc`), 'utf8')
                .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
                .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(account, t.Address)],
            });
        };
        this.getKittyItemType = async (itemId) => {
            // script should be fixed!
            const script = fs
                .readFileSync(path.join(process.env.CADENCE_PATH || __dirname, `../../cadence/kittyItems/scripts/read_kitty_item_type_id.cdc`), 'utf8')
                .replace(/0xNONFUNGIBLETOKEN/gi, `0x${this.nonFungibleTokenAddress}`)
                .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
            return this.flowService.executeScript({
                script,
                args: [fcl.arg(itemId, t.UInt64)],
            });
        };
        this.getSupply = async () => {
            const script = fs
                .readFileSync(path.join(process.env.CADENCE_PATH || __dirname, `../../cadence/kittyItems/scripts/read_kitty_items_supply.cdc`), 'utf8')
                .replace(/0xKITTYITEMS/gi, `0x${this.kittyItemsAddress}`);
            return this.flowService.executeScript({ script, args: [] });
        };
    }
}
exports.KittyItemsService = KittyItemsService;
