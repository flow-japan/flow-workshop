"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleOfferDBModel = void 0;
const base_1 = require("./base");
const tokensDBModel_1 = require("./tokensDBModel");
class SaleOfferDBModel extends base_1.BaseModel {
    static get tableName() {
        return 'sale_offers';
    }
    static get idColumn() {
        return ['saleOfferId'];
    }
}
exports.SaleOfferDBModel = SaleOfferDBModel;
SaleOfferDBModel.relationMappings = {
    tokens: {
        relation: base_1.BaseModel.BelongsToOneRelation,
        modelClass: tokensDBModel_1.TokensDBModel,
        join: {
            from: ['sale_offers.tokenId', 'sale_offers.tokenAddress'],
            to: ['tokens.id', 'tokens.tokenAddress'],
        },
    },
};
