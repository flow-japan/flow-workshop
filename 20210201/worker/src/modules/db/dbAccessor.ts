import Token from '../../valueObjects';
import { TokensDBModel } from './objection/models/tokensDBModel';
import { SaleOfferDBModel } from './objection/models/saleOfferDBModel';
import Knex from 'knex';
import { Model } from 'objection';
import { BlockCursorDBModel } from './objection/models/blockCursorDBModel';
import { PurchaseDBModel } from './objection/models/purchaseDBModel';
import { FlowEventDBModel } from './objection/models/flowEventDBModel';
class DBAccessor {
  init(): void {
    const knexInstance = Knex({
      client: 'postgresql',
      connection: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
      },
      migrations: {
        directory:
          process.env.MIGRATION_PATH || './src/modules/db/objection/migrations',
      },
    });
    Model.knex(knexInstance);
  }

  //SaleOffer
  findMostRecentSales(
    limit: number,
    offset: number,
  ): Promise<SaleOfferDBModel[]> {
    return SaleOfferDBModel.query()
      .orderBy('created_at', 'desc')
      .where('isFinished', false)
      .limit(limit)
      .offset(offset);
  }
  getSaleOffer(saleOfferId: number): Promise<SaleOfferDBModel> {
    return SaleOfferDBModel.query().findById([saleOfferId]);
  }

  insertSaleOffer(
    tokenId: number,
    saleOfferId: number,
    tokenAddress: string,
    marketAddress: string,
    price: string,
  ): Promise<SaleOfferDBModel[]> {
    return SaleOfferDBModel.query().upsertGraphAndFetch(
      [
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
      ],
      {
        insertMissing: true,
        relate: true,
      },
    );
  }
  finishSaleOffer(saleOfferId: number): Promise<SaleOfferDBModel> {
    return SaleOfferDBModel.query().updateAndFetchById([saleOfferId], {
      isFinished: true,
    });
  }
  updateSellerAndCollectionAddressInSaleOffer(
    saleOfferId: number,
    collectionAddress: string,
  ): Promise<SaleOfferDBModel> {
    return SaleOfferDBModel.query().updateAndFetchById([saleOfferId], {
      collectionAddress: collectionAddress,
      sellerAddress: collectionAddress,
    });
  }
  updateCollectionAddressInSaleOffer(
    saleOfferId: number,
    collectionAddress: string,
  ): Promise<SaleOfferDBModel> {
    return SaleOfferDBModel.query().updateAndFetchById([saleOfferId], {
      collectionAddress: collectionAddress,
    });
  }

  //Tokens
  upsertToken(token: Token): Promise<TokensDBModel[]> {
    return TokensDBModel.query().upsertGraphAndFetch(
      [
        {
          id: token.id,
          ownerAddress: token.ownerAddress,
          tokenAddress: token.tokenAddress,
        },
      ],
      { insertMissing: true },
    );
  }

  getToken(tokenId: number, tokenAddress: string): Promise<TokensDBModel> {
    const result = TokensDBModel.query().findById([tokenId, tokenAddress]);
    return result;
  }

  //BlockCursor
  findLatestBlockCursor(tokenName: string): Promise<BlockCursorDBModel> {
    const result = BlockCursorDBModel.query().findOne({
      token_name: tokenName,
    });
    return result;
  }
  upsertBlockCursor(
    id: string | undefined,
    blockHeight: number,
    eventName: string,
  ): Promise<BlockCursorDBModel[]> {
    const dataObj: {
      id?: string;
      current_block_height: number;
      token_name: string;
    } = {
      current_block_height: blockHeight,
      token_name: eventName,
    };
    if (id) {
      dataObj.id = id;
    }
    const result = BlockCursorDBModel.query().upsertGraphAndFetch([dataObj], {
      insertMissing: true,
    });
    return result;
  }

  //Purchase
  insertNewPurchase(
    saleOfferId: number,
    tokenId: number,
    tokenAddress: string,
    buyerAddress: string,
    sellerAddress: string | undefined,
    txHash: string,
    blockHeight: number,
    price: string,
  ): Promise<PurchaseDBModel> {
    return PurchaseDBModel.query().insertAndFetch({
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
  findPurchaseById(saleOfferId: number): Promise<PurchaseDBModel> {
    return PurchaseDBModel.query().findById([saleOfferId]);
  }

  findResentPurchases(
    itemId: number,
    tokenAddress: string,
    limit: number,
    offset: number,
  ): Promise<PurchaseDBModel[]> {
    return PurchaseDBModel.query()
      .orderBy('created_at', 'desc')
      .where('tokenId', itemId)
      .where('tokenAddress', tokenAddress)
      .limit(limit)
      .offset(offset);
  }

  //Flow Event
  insertFlowEvent(
    rawEvent: string,
    blockHeight: number,
  ): Promise<FlowEventDBModel> {
    return FlowEventDBModel.query().insertAndFetch({
      raw_event: rawEvent,
      block_height: blockHeight,
    });
  }

  findRecentFlowEvents(
    limit: number,
    offset: number,
  ): Promise<FlowEventDBModel[]> {
    return FlowEventDBModel.query()
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);
  }
}
const dbAccessor = new DBAccessor();

export { dbAccessor, DBAccessor };
