import { BaseModel } from './base';

class FlowEventDBModel extends BaseModel {
  id!: string;
  raw_event!: string;
  block_height!: number;

  static get tableName() {
    return 'flow_events';
  }
}

export { FlowEventDBModel };
