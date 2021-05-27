export interface Event {
  type: string;
  transactionId: string;
  transactionIndex: number;
  eventIndex: number;
  blockHeight: number;
  data:
  | SaleOfferCreatedEventData
  | SaleOfferAcceptedEventData
  | SaleOfferFinishedEventData
  | CollectionInsertedSaleOffer
  | CollectionRemovedSaleOffer
  | DepositEventData
  | WithdrawEventData;
}

export type WithdrawEventData = {
  id: number;
  from: string;
};

export type DepositEventData = {
  id: number;
  to: string;
};

export type SaleOfferCreatedEventData = {
  id: number;
  itemID: number;
  itemTokenAddress: string;
  itemTokenName: string;
  paymentTokenAddress: string;
  paymentTokenName: string;
  price: string;
};

export type SaleOfferAcceptedEventData = {
  id: number;
  itemTokenAddress: string;
  itemTokenName: string;
  itemID: number;
};

export type SaleOfferFinishedEventData = {
  id: number;
  itemTokenAddress: string;
  itemTokenName: string;
  itemID: number;
};

export type CollectionInsertedSaleOffer = {
  saleOfferId: number;
  saleItemTokenAddress: string;
  saleItemTokenName: string;
  saleItemID: number;
  saleItemCollection: string;
};

export type CollectionRemovedSaleOffer = {
  saleOfferId: number;
  saleItemTokenAddress: string;
  saleItemTokenName: string;
  saleItemID: number;
  saleItemCollection: string;
};
