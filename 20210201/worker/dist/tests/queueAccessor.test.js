"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queueAccessor_1 = require("../modules/queue/queueAccessor");
let ackIds;
let messages;
jest.setTimeout(30000);
const testDatas = [
    {
        type: 'A.fcceff21d9532b58.KittyItems.Deposit',
        transactionId: 'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
        transactionIndex: 1,
        eventIndex: 5,
        data: { id: 0, to: '0xeac0795db116f67b' },
        blockHeight: 2000049558,
    },
    {
        type: 'A.fcceff21d9532b58.KittyItems.Deposit',
        transactionId: 'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
        transactionIndex: 1,
        eventIndex: 5,
        data: { id: 0, to: '0xeac0795db116f67b' },
        blockHeight: 2000049558,
    },
    {
        type: 'A.fcceff21d9532b58.KittyItems.Deposit',
        transactionId: 'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
        transactionIndex: 1,
        eventIndex: 5,
        data: { id: 0, to: '0xeac0795db116f67b' },
        blockHeight: 2000049558,
    },
    {
        type: 'A.fcceff21d9532b58.KittyItems.Deposit',
        transactionId: 'b3b36a1b419865e0238dcfb66175901615318ccb526f48a8711997bbdf27bbaf',
        transactionIndex: 1,
        eventIndex: 5,
        data: { id: 0, to: '0xeac0795db116f67b' },
        blockHeight: 2000049558,
    },
];
const testDataString = testDatas.map((v) => JSON.stringify(testDatas));
test('register messages', async () => {
    const result = await queueAccessor_1.queueAccessor.register(testDataString);
    console.log('registered', result);
    expect(result).toBeDefined();
});
test('pullMessage', async () => {
    const result = await queueAccessor_1.queueAccessor.pullMessages();
    messages = result.receivedMessages?.map((v) => decodeBuffer(v.message?.data));
    ackIds = result.receivedMessages?.map((v) => v.ackId);
    expect(messages[0]).toEqual(testDataString[0]);
    function decodeBuffer(buffer) {
        const message = Buffer.from(buffer, 'base64').toString('utf-8');
        console.log(message);
        return message;
    }
});
test('ack message', async () => {
    const result = await queueAccessor_1.queueAccessor.ack(ackIds);
    console.log(result);
    expect(result[0]).toEqual({});
});
