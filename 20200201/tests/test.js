require('chai').should();
const flow = require('./services/flow');
const deployer = require('./services/deployer');
const utils = require('./utils/testUtils');
const config = require('./config');

describe('KittyItemsMarket', () => {
  let deployedAccount;

  before(async () => {
    flow.init(config.apiUrl, config.deployerAddress, config.deployerPrivateKey, config.deployerKeyIndex);
    deployedAccount = await deployer.deploy(flow, config.fungibleTokenAddress);
    await utils.initAccount(deployedAccount);
    await utils.mintFT(deployedAccount);
    await utils.mintNFT(deployedAccount);
  });

  describe('Sell', () => {
    it('should success', async () => {
      const res = await utils.sell(deployedAccount);
      console.log(res.events);
      res.events.length.should.equal(2);
      res.events[0].type.should.have.string('SaleOfferCreated');
      res.events[1].type.should.have.string('CollectionInsertedSaleOffer');
    });

    // TODO: 同じアカウントで購入しているが、本来は別のアカウントで購入のテストをするべき
    describe('Buy', () => {
      it('should success', async () => {
        const res = await utils.buy(deployedAccount);
        console.log(res.events);
        res.events.length.should.equal(8);
        res.events[0].type.should.have.string('Kibble.TokensWithdrawn');
        res.events[1].type.should.have.string('KittyItemsMarket.CollectionRemovedSaleOffer');
        res.events[2].type.should.have.string('Kibble.TokensDeposited');
        res.events[3].type.should.have.string('Kibble.TokensBurned'); // amount: '0.00000000'
        res.events[4].type.should.have.string('KittyItems.Withdraw');
        res.events[5].type.should.have.string('KittyItems.Deposit');
        res.events[6].type.should.have.string('KittyItemsMarket.SaleOfferAccepted');
        res.events[7].type.should.have.string('KittyItemsMarket.SaleOfferFinished');
      });
    });  
  });
});
