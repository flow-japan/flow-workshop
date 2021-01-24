require('chai').should();
const flow = require('./services/flow');
const deployer = require('./services/deployer');
const utils = require('./utils/testUtils');
const config = require('./config');

describe('SampleMarket', async () => {
  let admin;
  let seller;
  let buyer;

  before(async () => {
    flow.init(config.apiUrl, config.deployerAddress, config.deployerPrivateKey, config.deployerKeyIndex);
    admin = await flow.createFlowAccount();
    console.log({ admin });
    // admin = {
    //   address: config.deployerAddress,
    //   privateKey: config.deployerPrivateKey,
    //   keyIndex: config.deployerKeyIndex
    // }
    seller = await flow.createFlowAccount();
    buyer = await flow.createFlowAccount();

    await deployer.deploy(admin, config.fungibleTokenAddress);

    await utils.initAccount(admin);
    await utils.initAccount(seller);
    await utils.initAccount(buyer);

    await utils.mintNFT({ to: seller });
    await utils.mintFT({ to: buyer });
    await utils.tranferFlowToken({ to: buyer });
  });

  describe.skip('Prepare', () => {
    it('should success', async () => {
      flow.init(config.apiUrl, config.deployerAddress, config.deployerPrivateKey, config.deployerKeyIndex);
      deployer.account = {
        address: config.deployerAddress,
        privateKey: config.deployerPrivateKey,
        keyIndex: config.deployerKeyIndex
      }
      const to = {
        address: 'e03daebed8ca0615'
      }
      await utils.mintNFT({ to });
      await utils.mintFT({ to });
      await utils.tranferFlowToken({ to });
    });
  });

  describe('Sell', () => {
    it('should success', async () => {
      const saleItemTokenAddress = `0x${deployer.account.address}`;
      const saleItemTokenName = 'KittyItems';
      const saleItemID = 0;
      // const salePaymentTokenAddress = `0x${config.flowTokenAddress}`;
      // const salePaymentTokenName = 'FlowToken';
      const salePaymentTokenAddress = `0x${deployer.account.address}`;
      const salePaymentTokenName = 'Kibble';
      const saleItemPrice = '10.0';
      const res = await utils.sell({ seller, saleItemTokenAddress, saleItemTokenName, saleItemID, salePaymentTokenAddress, salePaymentTokenName, saleItemPrice });
      console.log(res.events);
      res.events.length.should.equal(2);
      res.events.some(e => e.type.includes('SaleOfferCreated')).should.be.true;
      res.events.some(e => e.type.includes('CollectionInsertedSaleOffer')).should.be.true;
    });

    describe('Buy', () => {
      it('should success', async () => {
        const saleItemTokenAddress = `0x${deployer.account.address}`;
        const saleItemTokenName = 'KittyItems';
        const saleItemID = 0;
        const res = await utils.buy({ buyer, seller, saleItemTokenAddress, saleItemTokenName, saleItemID });
        console.log(res.events);
        res.events.some(e => e.type.includes('TokensWithdrawn')).should.be.true;
        res.events.some(e => e.type.includes('TokensDeposited')).should.be.true;
        res.events.some(e => e.type.includes('KittyItems.Withdraw')).should.be.true;
        res.events.some(e => e.type.includes('KittyItems.Deposit')).should.be.true;
        res.events.some(e => e.type.includes('SampleMarket.CollectionRemovedSaleOffer')).should.be.true;
        res.events.some(e => e.type.includes('SampleMarket.SaleOfferAccepted')).should.be.true;
        res.events.some(e => e.type.includes('SampleMarket.SaleOfferFinished')).should.be.true;
      });
    });
  });
});
