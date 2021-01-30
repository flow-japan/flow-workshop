"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchaseDBModel = void 0;
const base_1 = require("./base");
class PurchaseDBModel extends base_1.BaseModel {
    static get tableName() {
        return 'purchases';
    }
    static get idColumn() {
        return ['saleOfferId'];
    }
}
exports.PurchaseDBModel = PurchaseDBModel;
