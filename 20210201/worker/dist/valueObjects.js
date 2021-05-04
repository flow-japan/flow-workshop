"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleOfferFinishedEvent = exports.SaleOfferAcceptedEvent = exports.CollectionInsertedSaleOfferEvent = exports.SaleOfferCreatedEvent = exports.RangeSettingsToFetchEvents = void 0;
class RangeSettingsToFetchEvents {
    constructor(_latestHeight, _lastHeight, _cusorId) {
        this._latestHeight = _latestHeight;
        this._lastHeight = _lastHeight;
        this._cusorId = _cusorId;
        this._start =
            this._lastHeight === 0 ? this._latestHeight - 1000 : this._lastHeight;
        this._end =
            this._lastHeight + 1000 > this._latestHeight
                ? this._latestHeight
                : this._lastHeight + 1000;
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
    get cursorId() {
        return this._cusorId;
    }
    get isLast() {
        return this._end === this._latestHeight;
    }
}
exports.RangeSettingsToFetchEvents = RangeSettingsToFetchEvents;
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
