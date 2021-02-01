"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const eventFetcher_1 = require("../controller/eventProcessor/eventFetcher");
test('worker can run', async () => {
    const result = await eventFetcher_1.run();
    console.log(result);
    expect(typeof result).toEqual('array');
});
