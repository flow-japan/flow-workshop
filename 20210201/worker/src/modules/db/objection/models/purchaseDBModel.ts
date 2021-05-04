import { BaseModel } from './base';
export class PurchaseDBModel extends BaseModel {
  saleOfferId!: number;
  tokenId!: number;
  tokenAddress!: string;
  buyerAddress!: string;
  sellerAddress!: string | undefined;
  txHash!: string;
  blockHeight!: number;
  price!: string;
  static get tableName(): string {
    return 'purchases';
  }
  static get idColumn() {
    return ['saleOfferId'];
  }
}
