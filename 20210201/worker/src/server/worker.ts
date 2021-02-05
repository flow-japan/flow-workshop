import { eventProcessor } from '../controller/eventProcessor';
import { generateRangeSettings } from '../controller/rangeGenerator';
const TOKEN_NAME = 'kitty_items';
async function run(): Promise<void> {
  while (true) {
    const range = await generateRangeSettings(TOKEN_NAME);
    await eventProcessor(range);
    if (range.isLast) {
      await delay(20000);
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

run().catch((error) => {
  console.error(error);
});
