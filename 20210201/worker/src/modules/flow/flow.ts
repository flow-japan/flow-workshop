import * as fcl from '@onflow/fcl';
import { latestBlock } from '@onflow/sdk-latest-block';
import { send } from '@onflow/sdk-send';
import { getEvents } from '@onflow/sdk-build-get-events';
import { BlockRange } from '../../valueObjects';

class FlowService {
  getAccount = async (addr: string) => {
    const { account } = await fcl.send([fcl.getAccount(addr)]);
    return account;
  };

  async getLatestBlockHeight(): Promise<number> {
    const blockHeight = await latestBlock();
    return blockHeight.height as number;
  }

  async getSingleEvent(eventName: string, range: BlockRange) {
    try {
      const rawResult = await send([
        getEvents(eventName, range.start, range.end),
      ]);
      const blockHeights = rawResult.events.map((x) => x.blockHeight);
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

  async getMultipleEvents(eventNames: string[], range: BlockRange) {
    const events = await Promise.all(
      eventNames.map((name) => this.getSingleEvent(name, range)),
    );
    return [].concat(...events);
  }
}

export { FlowService };
