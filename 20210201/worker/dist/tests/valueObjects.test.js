"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const valueObjects_1 = require("../valueObjects");
test('create SaleOfferCreatedEvent', () => {
    const event = new valueObjects_1.SaleOfferCreatedEvent('123', '3455', 123456, 40, '11230');
    expect(event.blockHeight).toEqual(123456);
    expect(event.price).toEqual('11230');
});
test('create collectionInsertedEvent', () => {
    const event = new valueObjects_1.CollectionInsertedSaleOfferEvent('123', '3455', 123456, 40, '0x80617c721f7c4cfa');
    expect(event.blockHeight).toEqual(123456);
    expect(event.collectionAddress).toEqual('0x80617c721f7c4cfa');
});
