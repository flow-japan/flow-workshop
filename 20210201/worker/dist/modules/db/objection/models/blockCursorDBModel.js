"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCursorDBModel = void 0;
const base_1 = require("./base");
class BlockCursorDBModel extends base_1.BaseModel {
    static get tableName() {
        return "block_cursor";
    }
}
exports.BlockCursorDBModel = BlockCursorDBModel;
