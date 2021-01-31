"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBAccessor = exports.dbAccessor = void 0;
const tokensDBModel_1 = require("./objection/models/tokensDBModel");
const saleOfferDBModel_1 = require("./objection/models/saleOfferDBModel");
const knex_1 = __importDefault(require("knex"));
const objection_1 = require("objection");
const blockCursorDBModel_1 = require("./objection/models/blockCursorDBModel");
const purchaseDBModel_1 = require("./objection/models/purchaseDBModel");
const flowEventDBModel_1 = require("./objection/models/flowEventDBModel");
class DBAccessor {
    init() {
        const knexInstance = knex_1.default({
            client: 'postgresql',
            connection: {
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME,
                host: process.env.DB_HOST,
            },
            migrations: {
                directory: process.env.MIGRATION_PATH || './src/modules/db/objection/migrations',
            },
        });
        objection_1.Model.knex(knexInstance);
    }
    //SaleOffer
    findMostRecentSales(limit, offset) {
        return saleOfferDBModel_1.SaleOfferDBModel.query()
            .orderBy('created_at', 'desc')
            .where('isFinished', false)
            .limit(limit)
            .offset(offset);
    }
    getSaleOffer(saleOfferId) {
        return saleOfferDBModel_1.SaleOfferDBModel.query().findById([saleOfferId]);
    }
    insertSaleOffer(tokenId, saleOfferId, tokenAddress, marketAddress, price) {
        return saleOfferDBModel_1.SaleOfferDBModel.query().upsertGraphAndFetch([
            {
                tokens: {
                    id: tokenId,
                    tokenAddress: tokenAddress,
                },
                saleOfferId: saleOfferId,
                price: price,
                marketAddress: marketAddress,
                isFinished: false,
            },
        ], {
            insertMissing: true,
            relate: true,
        });
    }
    finishSaleOffer(saleOfferId) {
        return saleOfferDBModel_1.SaleOfferDBModel.query().updateAndFetchById([saleOfferId], {
            isFinished: true,
        });
    }
    updateSellerAndCollectionAddressInSaleOffer(saleOfferId, collectionAddress) {
        return saleOfferDBModel_1.SaleOfferDBModel.query().updateAndFetchById([saleOfferId], {
            collectionAddress: collectionAddress,
            sellerAddress: collectionAddress,
        });
    }
    updateCollectionAddressInSaleOffer(saleOfferId, collectionAddress) {
        return saleOfferDBModel_1.SaleOfferDBModel.query().updateAndFetchById([saleOfferId], {
            collectionAddress: collectionAddress,
        });
    }
    //Tokens
    upsertToken(token) {
        return tokensDBModel_1.TokensDBModel.query().upsertGraphAndFetch([
            {
                id: token.id,
                ownerAddress: token.ownerAddress,
                tokenAddress: token.tokenAddress,
            },
        ], { insertMissing: true });
    }
    getToken(tokenId, tokenAddress) {
        const result = tokensDBModel_1.TokensDBModel.query().findById([tokenId, tokenAddress]);
        return result;
    }
    //BlockCursor
    findLatestBlockCursor(tokenName) {
        const result = blockCursorDBModel_1.BlockCursorDBModel.query().findOne({
            token_name: tokenName,
        });
        return result;
    }
    upsertBlockCursor(id, blockHeight, eventName) {
        const dataObj = {
            current_block_height: blockHeight,
            token_name: eventName,
        };
        if (id) {
            dataObj.id = id;
        }
        const result = blockCursorDBModel_1.BlockCursorDBModel.query().upsertGraphAndFetch([dataObj], {
            insertMissing: true,
        });
        return result;
    }
    //Purchase
    insertNewPurchase(saleOfferId, tokenId, tokenAddress, buyerAddress, sellerAddress, txHash, blockHeight, price) {
        return purchaseDBModel_1.PurchaseDBModel.query().insertAndFetch({
            saleOfferId: saleOfferId,
            tokenId: tokenId,
            tokenAddress: tokenAddress,
            buyerAddress: buyerAddress,
            sellerAddress: sellerAddress,
            txHash: txHash,
            blockHeight: blockHeight,
            price: price,
        });
    }
    findPurchaseById(saleOfferId) {
        return purchaseDBModel_1.PurchaseDBModel.query().findById([saleOfferId]);
    }
    findResentPurchases(itemId, tokenAddress, limit, offset) {
        return purchaseDBModel_1.PurchaseDBModel.query()
            .orderBy('created_at', 'desc')
            .where('tokenId', itemId)
            .where('tokenAddress', tokenAddress)
            .limit(limit)
            .offset(offset);
    }
    //Flow Event
    insertFlowEvent(rawEvent, blockHeight) {
        return flowEventDBModel_1.FlowEventDBModel.query().insertAndFetch({
            raw_event: rawEvent,
            block_height: blockHeight,
        });
    }
    findRecentFlowEvents(limit, offset) {
        return flowEventDBModel_1.FlowEventDBModel.query()
            .orderBy('created_at', 'desc')
            .limit(limit)
            .offset(offset);
    }
}
exports.DBAccessor = DBAccessor;
const dbAccessor = new DBAccessor();
exports.dbAccessor = dbAccessor;
