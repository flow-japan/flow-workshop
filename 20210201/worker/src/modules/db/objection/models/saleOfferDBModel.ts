import { BaseModel } from './base';
import { TokensDBModel } from './tokensDBModel';

export class SaleOfferDBModel extends BaseModel {
  tokenId!: string;
  saleOfferId!: number;
  price!: string;
  sellerAddress?: string;
  collectionAddress?: string;
  txHash?: string;
  isFinished!: boolean;
  marketAddress!: string;
  tokenAdderss!: string;
  tokens?: TokensDBModel;

  static get tableName(): string {
    return 'sale_offers';
  }
  static get idColumn() {
    return ['saleOfferId'];
  }

  static relationMappings = {
    tokens: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: TokensDBModel,
      join: {
        from: ['sale_offers.tokenId', 'sale_offers.tokenAddress'],
        to: ['tokens.id', 'tokens.tokenAddress'],
      },
    },
  };
}
