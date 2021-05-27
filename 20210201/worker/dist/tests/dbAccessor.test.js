"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbAccessor_1 = require("../modules/db/dbAccessor");
const valueObjects_1 = __importDefault(require("../valueObjects"));
//require running postgres container.
dbAccessor_1.dbAccessor.init();
test('can save new token', async () => {
    const token = new valueObjects_1.default(350, '0xfcceff21d9532b58', 'kitty_items');
    const result = await dbAccessor_1.dbAccessor.upsertToken(token);
    expect(result).toBeDefined();
});
test('get token info', async () => {
    const result = await dbAccessor_1.dbAccessor.getToken(350, 'kitty_items');
    expect(result.ownerAddress).toEqual('0xfcceff21d9532b58');
});
test('save new sale offer', async () => {
    const result = await dbAccessor_1.dbAccessor.insertSaleOffer(320, 'test_token_name', 1005, 'kitty_items', '0x3r984q8flfjak', 'kibble', '0xfcceff21d9532b58', '100');
    expect(result).toBeDefined();
});
test('get sale offer', async () => {
    const result = await dbAccessor_1.dbAccessor.getSaleOffer(1005);
    expect(result.tokenId).toEqual(320);
    expect(result.paymentTokenName).toEqual('kibble');
});
test('save collection address', async () => {
    const result = await dbAccessor_1.dbAccessor.updateCollectionAddressInSaleOffer(1005, 'test_address');
    expect(result.collectionAddress).toEqual('test_address');
});
test('find most recent sales.', async () => {
    const result = await dbAccessor_1.dbAccessor.findMostRecentSales(20, 0);
    expect(result.length).toBeGreaterThan(0);
});
test('delete collection address', async () => {
    const result = await dbAccessor_1.dbAccessor.updateCollectionAddressInSaleOffer(1005, '');
    expect(result.collectionAddress).toEqual('');
});
test('finish sale offer', async () => {
    const result = await dbAccessor_1.dbAccessor.finishSaleOffer(1005);
    expect(result.isFinished).toEqual(true);
});
test('save new purchase', async () => {
    const result = await dbAccessor_1.dbAccessor.insertNewPurchase(Math.floor(new Date().getTime() / 1000), 320, 'kitty_items', 'buyerAddress', 'sellerAddress', 'foawjiowejfaojfoawjofjwa-hash', 20000345, '100.000');
    expect(result).toBeDefined();
});
test('Update blockCursorById', async () => {
    const result = await dbAccessor_1.dbAccessor.upsertBlockCursor('0642618b-60ec-4166-b0e6-8e29bcebcaf8', 20022656, 'A.fcceff21d9532b58.KittyItemsMarket.CollectionInsertedSaleOffer');
    expect(result).toBeDefined();
});
test('find latest block cursor, if not create it.', async () => {
    const result = await dbAccessor_1.dbAccessor.findLatestBlockCursor('A.fcceff21d9532b58.KittyItemsMarket.CollectionInsertedSaleOffer');
    expect(result).toBeDefined();
});
test('find create event logs', async () => {
    const result = await dbAccessor_1.dbAccessor.insertFlowEvent('event log sample', 20004134);
    expect(result).toBeDefined();
});
test('find recent event logs', async () => {
    const result = await dbAccessor_1.dbAccessor.findRecentFlowEvents(10, 0);
    expect(result.length).toBeGreaterThan(0);
});
