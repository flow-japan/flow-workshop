export class RangeSettingsToFetchEvents {
  private _start: number;
  private _end: number;
  constructor(
    private readonly _latestHeight: number,
    private readonly _lastHeight: number,
    private readonly _cusorId: string,
  ) {
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
  get start(): number {
    return this._start;
  }
  get end(): number {
    return this._end;
  }
  get diff(): number {
    return this._end - this._start;
  }
  get cursorId(): string {
    return this._cusorId;
  }
  get isLast(): boolean {
    return this._end === this._latestHeight;
  }
}

class Event {
  constructor(
    private readonly _type: string,
    private readonly _transactionId: string,
    private readonly _blockHeight: number,
  ) { }
  get type(): string {
    return this._type;
  }
  get transactionId(): string {
    return this._transactionId;
  }
  get blockHeight(): number {
    return this._blockHeight;
  }
}

export class SaleOfferCreatedEvent extends Event {
  constructor(
    _type: string,
    _transactionId: string,
    _blockHeight: number,
    private readonly _itemID: number,
    private readonly _price: string,
  ) {
    super(_type, _transactionId, _blockHeight);
  }
  get itemId(): number {
    return this._itemID;
  }
  get price(): string {
    return this._price;
  }
}

export class CollectionInsertedSaleOfferEvent extends Event {
  constructor(
    _type: string,
    _transactionId: string,
    _blockHeight: number,
    private readonly _itemID: number,
    private readonly _collectionAddress: string,
  ) {
    super(_type, _transactionId, _blockHeight);
  }
  get itemId(): number {
    return this._itemID;
  }
  get collectionAddress(): string {
    return this._collectionAddress;
  }
}

export class SaleOfferAcceptedEvent extends Event { }
export class SaleOfferFinishedEvent extends Event { }

export type SupportedEvents =
  | SaleOfferFinishedEvent
  | CollectionInsertedSaleOfferEvent;

export default class Token {
  constructor(
    private readonly _id: number,
    private readonly _ownerAddress: string,
    private readonly _tokenAddress: string,
  ) { }

  get id(): number {
    return this._id;
  }

  get ownerAddress(): string {
    return this._ownerAddress;
  }

  get tokenAddress(): string {
    return this._tokenAddress;
  }
}
