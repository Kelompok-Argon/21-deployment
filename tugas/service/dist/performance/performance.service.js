"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarySvc = void 0;
const performance_1 = require("./performance");
async function summarySvc(req, res) {
    try {
        const sums = await performance_1.summary();
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(sums));
        res.end();
    }
    catch (err) {
        res.statusCode = 500;
        res.end();
        return;
    }
}
exports.summarySvc = summarySvc;
