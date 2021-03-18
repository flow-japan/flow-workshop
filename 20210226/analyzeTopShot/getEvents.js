const config = require('./config');
const fcl = require('@onflow/fcl');
const sdk = require('@onflow/sdk');
const { createObjectCsvWriter } = require('csv-writer');

let blockHeightToTimestamp = {};

const sleep = (ms = 5000) => new Promise(r => setTimeout(r, ms))

const splitChunks = ([...array], size = 1) => {
  return array.reduce((acc, _value, index) => index % size ? acc : [...acc, array.slice(index, index + size)], []);
}

const getEvents = async (eventType, fromBlock, toBlock) => {
  for (let count = 0; count < 10; count++) {
    try {
      console.log(eventType, fromBlock, '-', toBlock);
      const eventsResponse = await fcl.send(await sdk.build([ sdk.getEventsAtBlockHeightRange(eventType, fromBlock, toBlock) ]));
      if (!eventsResponse || !eventsResponse.events || eventsResponse.events.length === 0) return [];
      
      const blockHeights = {};
      const txIdToBlockHeight = eventsResponse.events.reduce((acc, e) => {
        blockHeights[e.blockHeight] = true;
        acc[e.transactionId] = e.blockHeight;
        return acc;
      }, {});
      
      const chunks = splitChunks(Object.keys(blockHeights), 10);
      for (const chunk of chunks) {
        await Promise.all(chunk.map(async (blockHeight)=>{
          if (!blockHeightToTimestamp[blockHeight]) {
            const blockResponse = await fcl.send(
              sdk.build([
                sdk.getBlock(),
                sdk.atBlockHeight(blockHeight)
              ])
            );
            const block = await fcl.decode(blockResponse);
            blockHeightToTimestamp[blockHeight] = block.timestamp.toDate().toISOString();
            console.log(blockHeight, blockHeightToTimestamp[blockHeight]);
          }
        }));
      }

      const events = await fcl.decode(eventsResponse);
      const res = events.map(e => {
        return {
          blockHeight: txIdToBlockHeight[e.transactionId],
          blockTimestamp: blockHeightToTimestamp[txIdToBlockHeight[e.transactionId]],
          ...e,
          id: e.data.id,
          price: e.data.price,
          seller: e.data.seller ? e.data.seller.replace('0x', '') : undefined,
          from: e.data.from ? e.data.from.replace('0x', '') : undefined,
          to: e.data.to ? e.data.to.replace('0x', '') : undefined,
        }
      });
      console.log(res[0]);
      return res;
    } catch (e) {
      console.log(e);
      await sleep();
      continue;
    }
  }
  throw new Error('Error occured 5 times');
};

const execute = async () => {
  fcl.config().put('accessNode.api', config.apiUrl);

  const _fromBlock = 12330636;
  const _toBlock = 12549261;
  const range = 10;

  let fromBlock = _fromBlock;
  let toBlock = fromBlock + range;
  while (true) {
    if (toBlock > _toBlock) toBlock = _toBlock;

    // Withdraw イベント取得
    const withdrawEvents = await getEvents('A.0b2a3299cc857e29.TopShot.Withdraw', fromBlock, toBlock);
    if (withdrawEvents && withdrawEvents.length > 0) {
      await createObjectCsvWriter({
        path: `./result/withdraw_${fromBlock}-${toBlock}.csv`,
        header: [
          {id:'blockHeight', title: 'blockHeight'},
          {id:'blockTimestamp', title: 'blockTimestamp'},
          {id:'transactionId', title: 'transactionId'},
          {id:'transactionIndex', title: 'transactionIndex'},
          {id:'eventIndex', title: 'eventIndex'},
          {id:'id', title: 'id'},
          {id:'from', title: 'from'},
        ]
      }).writeRecords(withdrawEvents);
    }

    // Deposit イベント取得
    const depositEvents = await getEvents('A.0b2a3299cc857e29.TopShot.Deposit', fromBlock, toBlock);
    if (depositEvents && depositEvents.length > 0) {
      await createObjectCsvWriter({
        path: `./result/deposit_${fromBlock}-${toBlock}.csv`,
        header: [
          {id:'blockHeight', title: 'blockHeight'},
          {id:'blockTimestamp', title: 'blockTimestamp'},
          {id:'transactionId', title: 'transactionId'},
          {id:'transactionIndex', title: 'transactionIndex'},
          {id:'eventIndex', title: 'eventIndex'},
          {id:'id', title: 'id'},
          {id:'to', title: 'to'},
        ]
      }).writeRecords(depositEvents);
    }

    // MomentPurchased イベント取得
    const purchasedEvents = await getEvents('A.c1e4f4f4c4257510.Market.MomentPurchased', fromBlock, toBlock);
    if (purchasedEvents && purchasedEvents.length > 0) {
      await createObjectCsvWriter({
        path: `./result/moment_purchase_${fromBlock}-${toBlock}.csv`,
        header: [
          {id: 'blockHeight', title: 'blockHeight'},
          {id: 'blockTimestamp', title: 'blockTimestamp'},
          {id: 'transactionId', title: 'transactionId'},
          {id: 'transactionIndex', title: 'transactionIndex'},
          {id: 'eventIndex', title: 'eventIndex'},
          {id: 'id', title: 'id'},
          {id: 'price', title: 'price'},
          {id: 'seller', title: 'seller'},
        ]
      }).writeRecords(purchasedEvents);
    }
    
    if (toBlock >= _toBlock) break;
    fromBlock = toBlock + 1;
    toBlock = fromBlock + range;

    blockHeightToTimestamp = {};
  }
}

try {
  execute();
} catch(e) {
  console.log(e);
}