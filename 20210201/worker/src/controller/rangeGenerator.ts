import { dbAccessor } from '../modules/db/dbAccessor';
import { flowService } from '../modules/flow/flowAccessor';
import { RangeSettingsToFetchEvents } from '../valueObjects';
export async function generateRangeSettings(
  tokenName: string,
): Promise<RangeSettingsToFetchEvents> {
  const latestHeight = await flowService.getLatestBlockHeight();
  console.log('latest height', latestHeight);
  const cursorDBModel = await dbAccessor.findLatestBlockCursor(tokenName);
  console.log(cursorDBModel);
  const cursorId = cursorDBModel ? cursorDBModel.id : undefined;
  const cursorHeight = cursorDBModel ? cursorDBModel.current_block_height : 0;

  return new RangeSettingsToFetchEvents(latestHeight, cursorHeight, cursorId);
}
