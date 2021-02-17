"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = exports.cors = exports.run = void 0;
const http_1 = require("http");
const url = require("url");
const process_1 = require("process");
const performance_service_1 = require("./performance.service");
const agg = require("./performance.agg");
const config_1 = require("../config");
let server;
function run(callback) {
    var _a;
    server = http_1.createServer((req, res) => {
        // cors
        const aborted = cors(req, res);
        if (aborted) {
            return;
        }
        function respond(statusCode, message) {
            res.statusCode = statusCode || 200;
            res.write(message || '');
            res.end();
        }
        try {
            const uri = url.parse(req.url, true);
            switch (uri.pathname) {
                case '/summary':
                    if (req.method === 'GET') {
                        return performance_service_1.summarySvc(req, res);
                    }
                    else {
                        respond(404, "not found");
                    }
                    break;
                default:
                    respond(404, "not found");
            }
        }
        catch (err) {
            respond(500, 'unkown server error');
        }
    });
    // run aggregation
    agg.run();
    // stop handler
    server.on('close', () => {
        agg.stop();
        if (callback) {
            callback();
        }
    });
    // run server
    const PORT = (_a = config_1.config === null || config_1.config === void 0 ? void 0 : config_1.config.server) === null || _a === void 0 ? void 0 : _a.portPerformance;
    server.listen(PORT, () => {
        process_1.stdout.write(`🚀 performance service listening on port ${PORT}\n`);
    });
}
exports.run = run;
function cors(req, res) {
    // handle preflight request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return true;
    }
}
exports.cors = cors;
function stop() {
    if (server) {
        server.close();
    }
}
exports.stop = stop;
