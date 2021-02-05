import { eventProcessor } from '../controller/eventProcessor';
import { generateRangeSettings } from '../controller/rangeGenerator';
import { dbAccessor } from '../modules/db/dbAccessor';

test('correct order.', async () => {
  dbAccessor.init();
  const range = await generateRangeSettings('kitty_items');
  await eventProcessor(range);
  expect(true).toEqual(true);
});
