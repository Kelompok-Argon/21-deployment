"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.info = void 0;
const http = require("http");
const config_1 = require("../config");
const WORKER_HOST = `http://localhost:${(_a = config_1.config === null || config_1.config === void 0 ? void 0 : config_1.config.server) === null || _a === void 0 ? void 0 : _a.portWorker}`;
const ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';
function info(id) {
    return new Promise((resolve, reject) => {
        const req = http.request(`${WORKER_HOST}/info?id=${id}`, (res) => {
            let data = '';
            if (res.statusCode === 404) {
                reject(ERROR_WORKER_NOT_FOUND);
            }
            res.on('data', (chunk) => {
                data += chunk.toString();
            });
            res.on('end', () => {
                const worker = JSON.stringify(data);
                resolve(worker);
            });
            res.on('error', (err) => {
                reject((err === null || err === void 0 ? void 0 : err.message) || err.toString());
            });
        });
        req.end();
    });
}
exports.info = info;
