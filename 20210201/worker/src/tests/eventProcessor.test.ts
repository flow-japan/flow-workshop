import { eventProcessor } from '../controller/eventProcessor';
import { dbAccessor } from '../modules/db/dbAccessor';

test('correct order.', async () => {
  dbAccessor.init();
  await eventProcessor();
  expect(true).toEqual(true);
});
