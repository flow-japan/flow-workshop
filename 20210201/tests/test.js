require('chai').should();
const flow = require('./services/flow');
const deployer = require('./services/deployer');
const utils = require('./utils/testUtils');
const config = require('./config');

describe('SampleMarket', () => {
  let admin;
  let seller;
  let buyer;

  let saleItemTokenAddress;
  let saleItemTokenName;
  let saleItemID;
  let salePaymentTokenAddress;
  let salePaymentTokenName;
  let saleItemPrice;

  before(async () => {
    flow.init(config.apiUrl, config.deployerAddress, config.deployerPrivateKey, config.deployerKeyIndex);
    admin = await flow.createFlowAccount();
    // admin = {
    //   address: config.deployerAddress,
    //   privateKey: config.deployerPrivateKey,
    //   keyIndex: config.deployerKeyIndex
    // }
    console.log({ admin });
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

  describe('Sell', function() {
    before(() => {
      saleItemTokenAddress = `0x${deployer.account.address}`;
      saleItemTokenName = 'KittyItems';
      saleItemID = 0;
      salePaymentTokenAddress = `0x${deployer.account.address}`;
      salePaymentTokenName = 'Kibble';
      saleItemPrice = '10.0';
      // salePaymentTokenAddress = `0x${config.flowTokenAddress}`;
      // salePaymentTokenName = 'FlowToken';
    });

    it('should success', async () => {
      const res = await utils.sell({ seller, saleItemTokenAddress, saleItemTokenName, saleItemID, salePaymentTokenAddress, salePaymentTokenName, saleItemPrice });
      console.log(res.events);
      res.events.length.should.equal(2);
      res.events.some(e => e.type.includes('SaleOfferCreated')).should.be.true;
      res.events.some(e => e.type.includes('CollectionInsertedSaleOffer')).should.be.true;
    });

    describe('Cancel', () => {
      it('should success', async () => {
        const res = await utils.cancel({ seller, saleItemTokenAddress, saleItemTokenName, saleItemID });
        console.log(res.events);
        res.events.some(e => e.type.includes('SampleMarket.CollectionRemovedSaleOffer')).should.be.true;
        res.events.some(e => e.type.includes('SampleMarket.SaleOfferFinished')).should.be.true;
        res.events.some(e => e.type.includes('SampleMarket.SaleOfferAccepted')).should.be.false;
      });

      describe('Re Sell', () => {
        it('should success', async () => {
          const res = await utils.sell({ seller, saleItemTokenAddress, saleItemTokenName, saleItemID, salePaymentTokenAddress, salePaymentTokenName, saleItemPrice });
          console.log(res.events);
          res.events.length.should.equal(2);
          res.events.some(e => e.type.includes('SaleOfferCreated')).should.be.true;
          res.events.some(e => e.type.includes('CollectionInsertedSaleOffer')).should.be.true;
        });
      });
    });

    describe('Buy', () => {
      it('should success', async () => {
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
