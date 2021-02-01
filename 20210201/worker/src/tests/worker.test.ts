import { run } from '../controller/eventProcessor/eventFetcher';

test('worker can run', async () => {
  const result = await run();
  console.log(result);
  expect(typeof result).toEqual('array');
});
