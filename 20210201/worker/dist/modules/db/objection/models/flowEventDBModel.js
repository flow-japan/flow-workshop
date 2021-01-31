"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowEventDBModel = void 0;
const base_1 = require("./base");
class FlowEventDBModel extends base_1.BaseModel {
    static get tableName() {
        return 'flow_events';
    }
}
exports.FlowEventDBModel = FlowEventDBModel;
