/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/// <reference path='./flow.d.ts' />
import * as fcl from '@onflow/fcl';
import { latestBlock } from '@onflow/sdk-latest-block';
import { send } from '@onflow/sdk-send';
import { getEvents } from '@onflow/sdk-build-get-events';
import { RangeSettingsToFetchEvents } from '../../valueObjects';
import { Event } from '../../types';

fcl.config().put('accessNode.api', process.env.FLOW_NODE);
class FlowService {
  async getLatestBlockHeight(): Promise<number> {
    const { height: blockHeight } = await fcl.latestBlock();
    return blockHeight as number;
  }

  async getSingleEvent(
    eventName: string,
    range: RangeSettingsToFetchEvents,
  ): Promise<Event[] | []> {
    let result: Event[] | [] = [];
    try {
      const rawResponse = await fcl.send([
        fcl.getEvents(eventName, range.start, range.end),
      ]);
      const blockHeights: number[] = rawResponse.events.map(
        (x: { blockHeight: number }) => x.blockHeight,
      );
      const decodedResponse = (await fcl.decode(rawResponse)) as Event[];
      result = decodedResponse.map(
        (v, i): Event => ({
          ...v,
          blockHeight: blockHeights[i],
        }),
      );
    } catch (e) {
      console.error(
        `error retrieving events for block range fromBlock=${range.start} toBlock=${range.end}`,
        e,
      );
    }
    return result;
  }

  async getMultipleEvents(
    eventNames: string[],
    range: RangeSettingsToFetchEvents,
  ): Promise<Event[]> {
    const events: (Event[] | [])[] = await Promise.all(
      eventNames.map((name) => this.getSingleEvent(name, range)),
    );
    const result = ([] as Event[]).concat(...events);
    return result;
  }
}

const flowService = new FlowService();
export { FlowService, flowService };
