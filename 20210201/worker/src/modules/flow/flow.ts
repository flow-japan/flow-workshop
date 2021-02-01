/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as fcl from '@onflow/fcl';
import { latestBlock } from '@onflow/sdk-latest-block';
import { send } from '@onflow/sdk-send';
import { getEvents } from '@onflow/sdk-build-get-events';
import { RangeSettingsToFetchEvents } from '../../valueObjects';
import { Event } from '../../types';
class FlowService {
  async getLatestBlockHeight(): Promise<number> {
    const blockHeight = await latestBlock();
    return blockHeight.height as number;
  }

  async getSingleEvent(
    eventName: string,
    range: RangeSettingsToFetchEvents,
  ): Promise<Event[] | undefined> {
    try {
      const rawResult = await send([
        getEvents(eventName, range.start, range.end),
      ]);
      const blockHeights: number[] = rawResult.events.map((x) => x.blockHeight);
      const result = await fcl.decode(rawResult);
      return result.map((v, i) => ({
        ...v,
        blockHeight: blockHeights[i],
      }));
    } catch (e) {
      console.error(
        `error retrieving events for block range fromBlock=${range.start} toBlock=${range.end}`,
        e,
      );
    }
  }

  async getMultipleEvents(
    eventNames: string[],
    range: RangeSettingsToFetchEvents,
  ) {
    const events = await Promise.all(
      eventNames.map((name) => this.getSingleEvent(name, range)),
    );
    return [].concat(...events);
  }
}
fcl.config().put('accessNode.api', process.env.FLOW_NODE);
const flowService = new FlowService();
export { FlowService, flowService };
