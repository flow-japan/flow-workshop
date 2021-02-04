import { flowService } from '../../modules/flow/flowAccessor';
import { RangeSettingsToFetchEvents } from '../../valueObjects';

import * as t from '../../types';
export async function eventFetcher(
  eventNames: string[],
  range: RangeSettingsToFetchEvents,
): Promise<t.Event[] | []> {
  if (range.diff < 10) {
    console.log(`skipped ${range.diff} blocks difference`);
    return [];
  }
  const events: t.Event[] = await flowService.getMultipleEvents(
    eventNames,
    range,
  );

  return events;
}
