const fs = require('fs');
const path = require('path');

class DeployerService {
  async deploy(flow, fungibleTokenAddress) {
    const account = await flow.createFlowAccount();
    const authorization = flow.authorize(account);

    // Deploy Kibble
    let contract = fs
      .readFileSync(path.join(__dirname, `../../cadence/contracts/Kibble.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${fungibleTokenAddress}`);
    const kibble = await flow.addContract({
      name: 'Kibble',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer: authorization
    });

    // Deploy Non fungible token contract
    contract = fs
      .readFileSync(path.join(__dirname, `../../cadence/contracts/NonFungibleToken.cdc`), 'utf8');
    await flow.addContract({
      name: 'NonFungibleToken',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer: authorization
    });

    // Deploy Kitty items
    contract = fs
      .readFileSync(path.join(__dirname, `../../cadence/contracts/KittyItems.cdc`), 'utf8')
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.address}`);
    const kittyItems = await flow.addContract({
      name: 'KittyItems',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer: authorization
    });

    // Deploy kitty items market
    contract = fs
      .readFileSync(path.join(__dirname, `../../cadence/contracts/kittyItemsMarket.cdc`), 'utf8')
      .replace(/0xFUNGIBLETOKENADDRESS/gi, `0x${fungibleTokenAddress}`)
      .replace(/0xNONFUNGIBLETOKEN/gi, `0x${account.address}`)
      .replace(/0xKIBBLE/gi, `0x${account.address}`)
      .replace(/0xKITTYITEMS/gi, `0x${account.address}`);
    const kittyItemsMarket = await flow.addContract({
      name: 'KittyItemsMarket',
      code: contract,
      authorizations: [authorization],
      proposer: authorization,
      payer: authorization
    });

    return account;
  }
}

module.exports = new DeployerService();