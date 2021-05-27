import { BaseModel } from "./base";

export class BlockCursorDBModel extends BaseModel {
  id!: string;
  flow_event_name!: string;
  current_block_height!: number;

  static get tableName() {
    return "block_cursor";
  }
}