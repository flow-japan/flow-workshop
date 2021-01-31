import * as fcl from '@onflow/fcl';
import { FlowService } from '../modules/flow/flow';
import { dbAccessor } from '../modules/db/dbAccessor';
import { BlockRange } from '../valueObjects';
import { EventRecorder } from './eventRecorder';

//constants
const eventNames = [
  'A.fc40912427c789d2.SampleMarket.SaleOfferCreated',
  'A.fc40912427c789d2.SampleMarket.SaleOfferAccepted',
  'A.fc40912427c789d2.SampleMarket.SaleOfferFinished',
  'A.fc40912427c789d2.SampleMarket.CollectionInsertedSaleOffer',
  'A.fc40912427c789d2.SampleMarket.CollectionRemovedSaleOffer',
];
const TOKEN_NAME = 'kitty_items';

fcl.config().put('accessNode.api', process.env.FLOW_NODE);
const flowService = new FlowService();
dbAccessor.init();
const eventRecorder = new EventRecorder(dbAccessor);

export async function run() {
  const latestHeight = await flowService.getLatestBlockHeight();
  const blockCursorDBModel = await dbAccessor.findLatestBlockCursor(TOKEN_NAME);
  const cursorHeight = blockCursorDBModel
    ? blockCursorDBModel.current_block_height
    : 0;
  const range = calculateBlockRange(latestHeight, cursorHeight);
  if (range.diff < 50) {
    return;
  }

  const events = await flowService.getMultipleEvents(eventNames, range);
  await eventRecorder.process(events);
  const cursorId: string | undefined = blockCursorDBModel
    ? blockCursorDBModel.id
    : undefined;
  await dbAccessor.upsertBlockCursor(cursorId, range.end, TOKEN_NAME);

  if (latestHeight !== range.end) {
    console.log('continue');
    await run();
  }
  return events;
}

function calculateBlockRange(
  latestHeight: number,
  cursorHeight: number,
): BlockRange {
  if (cursorHeight === 0) {
    return new BlockRange(latestHeight - 100, latestHeight);
  }
  if (cursorHeight + 1000 > latestHeight) {
    return new BlockRange(cursorHeight, latestHeight);
  } else {
    return new BlockRange(cursorHeight, cursorHeight + 1000);
  }
}
