"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = exports.cors = exports.run = void 0;
const http_1 = require("http");
const url = require("url");
const process_1 = require("process");
const task_service_1 = require("./task.service");
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
                case '/add':
                    if (req.method === 'POST') {
                        return task_service_1.addSvc(req, res);
                    }
                    else {
                        respond(404);
                    }
                    break;
                case '/list':
                    if (req.method === 'GET') {
                        return task_service_1.listSvc(req, res);
                    }
                    else {
                        respond(404);
                    }
                    break;
                case '/done':
                    if (req.method === 'PUT') {
                        return task_service_1.doneSvc(req, res);
                    }
                    else {
                        respond(404);
                    }
                    break;
                case '/cancel':
                    if (req.method === 'PUT') {
                        return task_service_1.cancelSvc(req, res);
                    }
                    else {
                        respond(404);
                    }
                    break;
                default:
                    if (/^\/attachment\/\w+/.test(uri.pathname)) {
                        return task_service_1.getAttachmentSvc(req, res);
                    }
                    respond(404);
            }
        }
        catch (err) {
            respond(500, 'unkown server error');
        }
    });
    // stop handler
    server.on('close', () => {
        if (callback) {
            callback();
        }
    });
    // run server
    const PORT = (_a = config_1.config === null || config_1.config === void 0 ? void 0 : config_1.config.server) === null || _a === void 0 ? void 0 : _a.portTask;
    server.listen(PORT, () => {
        process_1.stdout.write(`🚀 task service listening on port ${PORT}\n`);
    });
}
exports.run = run;
function cors(req, res) {
    // handle preflight request
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
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
