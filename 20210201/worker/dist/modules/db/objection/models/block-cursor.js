"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockCursor = void 0;
const base_1 = require("./base");
class BlockCursor extends base_1.BaseModel {
    static get tableName() {
        return "block_cursor";
    }
}
exports.BlockCursor = BlockCursor;
