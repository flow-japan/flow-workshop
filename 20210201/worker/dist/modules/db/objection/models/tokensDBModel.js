"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensDBModel = void 0;
const base_1 = require("./base");
class TokensDBModel extends base_1.BaseModel {
    static get tableName() {
        return "tokens";
    }
    static get idColumn() {
        return ['id', 'tokenAddress'];
    }
}
exports.TokensDBModel = TokensDBModel;
