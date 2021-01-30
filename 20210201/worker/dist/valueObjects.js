"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleOfferFinishedEvent = exports.SaleOfferAcceptedEvent = exports.CollectionInsertedSaleOfferEvent = exports.SaleOfferCreatedEvent = exports.BlockRange = void 0;
class BlockRange {
    constructor(_start, _end) {
        this._start = _start;
        this._end = _end;
        if (this._start >= this._end) {
            console.error('start height is bigger than /equal to end height');
        }
    }
    get start() {
        return this._start;
    }
    get end() {
        return this._end;
    }
    get diff() {
        return this._end - this._start;
    }
}
exports.BlockRange = BlockRange;
class Event {
    constructor(_type, _transactionId, _blockHeight) {
        this._type = _type;
        this._transactionId = _transactionId;
        this._blockHeight = _blockHeight;
    }
    get type() {
        return this._type;
    }
    get transactionId() {
        return this._transactionId;
    }
    get blockHeight() {
        return this._blockHeight;
    }
}
class SaleOfferCreatedEvent extends Event {
    constructor(_type, _transactionId, _blockHeight, _itemID, _price) {
        super(_type, _transactionId, _blockHeight);
        this._itemID = _itemID;
        this._price = _price;
    }
    get itemId() {
        return this._itemID;
    }
    get price() {
        return this._price;
    }
}
exports.SaleOfferCreatedEvent = SaleOfferCreatedEvent;
class CollectionInsertedSaleOfferEvent extends Event {
    constructor(_type, _transactionId, _blockHeight, _itemID, _collectionAddress) {
        super(_type, _transactionId, _blockHeight);
        this._itemID = _itemID;
        this._collectionAddress = _collectionAddress;
    }
    get itemId() {
        return this._itemID;
    }
    get collectionAddress() {
        return this._collectionAddress;
    }
}
exports.CollectionInsertedSaleOfferEvent = CollectionInsertedSaleOfferEvent;
class SaleOfferAcceptedEvent extends Event {
}
exports.SaleOfferAcceptedEvent = SaleOfferAcceptedEvent;
class SaleOfferFinishedEvent extends Event {
}
exports.SaleOfferFinishedEvent = SaleOfferFinishedEvent;
class Token {
    constructor(_id, _ownerAddress, _tokenAddress) {
        this._id = _id;
        this._ownerAddress = _ownerAddress;
        this._tokenAddress = _tokenAddress;
    }
    get id() {
        return this._id;
    }
    get ownerAddress() {
        return this._ownerAddress;
    }
    get tokenAddress() {
        return this._tokenAddress;
    }
}
exports.default = Token;
