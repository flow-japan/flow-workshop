const fs = require('fs');
const path = require('path');
const fcl = require('@onflow/fcl');
const types = require('@onflow/types');
const flow = require('../services/flow');
const config = require('../config');

class TestUtils {
  async initAccount(account) {
    const authorization = flow.authorize(account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/0_init_account.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.address}`)
      .replace(/0xKIBBLE/gi, `0x${account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${account.address}`)
      .replace(/0xKITTYMARKET/gi, `0x${account.address}`);
    return await flow.sendTx({
      transaction,
      args: [],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async mintFT(account) {
    const amount = '10.0';
    const authorization = flow.authorize(account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/1_mint_ft.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.address}`)
      .replace(/0xKIBBLE/gi, `0x${account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${account.address}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(`0x${account.address}`, types.Address),
        fcl.arg(String(amount), types.UFix64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async mintNFT(account) {
    const typeID = 1;
    const authorization = flow.authorize(account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/2_mint_nft.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.address}`)
      .replace(/0xKIBBLE/gi, `0x${account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${account.address}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(`0x${account.address}`, types.Address),
        fcl.arg(Number(typeID), types.UInt64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async sell(account) {
    const saleItemID = 0;
    const saleItemPrice = '10.0'
    const authorization = flow.authorize(account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/3_sell.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.address}`)
      .replace(/0xKIBBLE/gi, `0x${account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${account.address}`)
      .replace(/0xKITTYMARKET/gi, `0x${account.address}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(Number(saleItemID), types.UInt64),
        fcl.arg(String(saleItemPrice), types.UFix64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async buy(account) {
    const saleItemID = 0;
    const marketCollectionAddress = account.address;
    const authorization = flow.authorize(account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/4_buy.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.address}`)
      .replace(/0xKIBBLE/gi, `0x${account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${account.address}`)
      .replace(/0xKITTYMARKET/gi, `0x${account.address}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(Number(saleItemID), types.UInt64),
        fcl.arg(`0x${marketCollectionAddress}`, types.Address)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };
}

module.exports = new TestUtils();