import { run } from '../worker';

test('worker can run', async () => {
  const result = await run();
  console.log(result);
  expect(typeof result).toEqual('array');
});
