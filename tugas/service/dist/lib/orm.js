"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connect = void 0;
const typeorm_1 = require("typeorm");
function connect(entities, config) {
    return typeorm_1.createConnection(Object.assign(Object.assign({}, config), { synchronize: true, timezone: 'Asia/Jakarta', entities }));
}
exports.connect = connect;
