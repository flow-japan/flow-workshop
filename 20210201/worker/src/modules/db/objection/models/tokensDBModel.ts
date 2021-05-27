import { BaseModel } from "./base";

export class TokensDBModel extends BaseModel {
  id!: number;
  ownerAddress!: string;
  tokenAddress!: string;

  static get tableName() {
    return "tokens";
  }
  static get idColumn() {
    return ['id', 'tokenAddress']
  }
}