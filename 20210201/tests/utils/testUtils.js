const fs = require('fs');
const path = require('path');
const fcl = require('@onflow/fcl');
const types = require('@onflow/types');
const config = require('../config');
const flow = require('../services/flow');
const deployer = require('../services/deployer');

class TestUtils {
  async initAccount(account) {
    const authorization = flow.authorize(account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/0_init_account.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${deployer.account.address}`)
      .replace(/0xKIBBLE/gi, `0x${deployer.account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${deployer.account.address}`)
      .replace(/0xSAMPLEMARKET/gi, `0x${deployer.account.address}`);
    return await flow.sendTx({
      transaction,
      args: [],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async mintNFT({ to }) {
    const typeID = 1;
    const authorization = flow.authorize(deployer.account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/2_mint_nft.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${deployer.account.address}`)
      .replace(/0xKIBBLE/gi, `0x${deployer.account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${deployer.account.address}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(`0x${to.address}`, types.Address),
        fcl.arg(Number(typeID), types.UInt64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async mintFT({ to }) {
    const amount = '100.0';
    const authorization = flow.authorize(deployer.account);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/1_mint_ft.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${deployer.account.address}`)
      .replace(/0xKIBBLE/gi, `0x${deployer.account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${deployer.account.address}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(`0x${to.address}`, types.Address),
        fcl.arg(String(amount), types.UFix64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async tranferFlowToken({ to }) {
    const amount = '10.0';
    const authorization = flow.authorizeAccount();
    const transaction = `
      import FungibleToken from 0xFUNGIBLETOKENADDRESS
      import FlowToken from 0xFLOWTOKEN
      
      transaction(recipient: Address, amount: UFix64) {
          let sentVault: @FungibleToken.Vault
          prepare(signer: AuthAccount) {
              let vaultRef = signer.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
                  ?? panic("Could not borrow reference to the owner's Vault!")
              self.sentVault <- vaultRef.withdraw(amount: amount)
          }
          execute {
              // Get the recipient's public account object
              let receiverRef = getAccount(recipient).getCapability(/public/flowTokenReceiver)!.borrow<&{FungibleToken.Receiver}>()
                  ?? panic("Could not borrow receiver reference to the recipient's Vault")
              receiverRef.deposit(from: <-self.sentVault)
          }
      }`
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xFLOWTOKEN/gi, `0x${config.flowTokenAddress}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(`0x${to.address}`, types.Address),
        fcl.arg(String(amount), types.UFix64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async sell({ seller, saleItemTokenAddress, saleItemTokenName, saleItemID, salePaymentTokenAddress, salePaymentTokenName, saleItemPrice }) {
    const authorization = flow.authorize(seller);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/3_sell.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${deployer.account.address}`)
      .replace(/0xKIBBLE/gi, `0x${deployer.account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${deployer.account.address}`)
      .replace(/0xSAMPLEMARKET/gi, `0x${deployer.account.address}`)
      .replace(/0xFLOWTOKEN/gi, `0x${config.flowTokenAddress}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(saleItemTokenAddress, types.Address),
        fcl.arg(saleItemTokenName, types.String),
        fcl.arg(Number(saleItemID), types.UInt64),
        fcl.arg(salePaymentTokenAddress, types.Address),
        fcl.arg(salePaymentTokenName, types.String),
        fcl.arg(String(saleItemPrice), types.UFix64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async cancel({ seller, saleItemTokenAddress, saleItemTokenName, saleItemID, salePaymentTokenAddress, salePaymentTokenName, saleItemPrice }) {
    const authorization = flow.authorize(seller);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/4_cancel.cdc`), 'utf8')
      .replace(/0xSAMPLEMARKET/gi, `0x${deployer.account.address}`)
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(saleItemTokenAddress, types.Address),
        fcl.arg(saleItemTokenName, types.String),
        fcl.arg(Number(saleItemID), types.UInt64)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };

  async buy({ buyer, seller, saleItemTokenAddress, saleItemTokenName, saleItemID }) {
    const marketCollectionAddress = `0x${seller.address}`;
    const authorization = flow.authorize(buyer);
    const transaction = fs
      .readFileSync(path.join(__dirname, `../../cadence/transactions/5_buy.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${config.fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${deployer.account.address}`)
      .replace(/0xKIBBLE/gi, `0x${deployer.account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${deployer.account.address}`)
      .replace(/0xSAMPLEMARKET/gi, `0x${deployer.account.address}`)
      .replace(/0xFLOWTOKEN/gi, `0x${config.flowTokenAddress}`);
    return await flow.sendTx({
      transaction,
      args: [
        fcl.arg(saleItemTokenAddress, types.Address),
        fcl.arg(saleItemTokenName, types.String),
        fcl.arg(Number(saleItemID), types.UInt64),
        fcl.arg(marketCollectionAddress, types.Address)
      ],
      proposer: authorization,
      authorizations: [authorization],
      payer: authorization
    });
  };
}

module.exports = new TestUtils();