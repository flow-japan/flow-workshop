"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("../worker");
test('worker can run', async () => {
    const result = await worker_1.run();
    console.log(result);
    expect(typeof result).toEqual('array');
});
