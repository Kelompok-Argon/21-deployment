"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const rc = require("rc");
const defaultConfig = {
    database: {
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '',
        database: 'sanbercode2',
    },
    objectStorage: {
        endPoint: '127.0.0.1',
        port: 9000,
        useSSL: false,
        accessKey: 'minioadmin',
        secretKey: 'minioadmin',
    },
    server: {
        portWorker: 7001,
        portTask: 7002,
        portPerformance: 7003,
    },
    host: {
        worker: 'http://localhost:7001',
    },
};
exports.config = rc('tm', defaultConfig);
