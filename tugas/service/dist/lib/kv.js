"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.drop = exports.read = exports.save = exports.connect = void 0;
const redis = require("redis");
const util_1 = require("util");
let client;
function connect(options) {
    return new Promise((resolve, reject) => {
        client = redis.createClient(options);
        client.on('connect', () => {
            resolve();
        });
        client.on('error', (err) => {
            reject(err);
        });
    });
}
exports.connect = connect;
function save(db, data) {
    const setAsync = util_1.promisify(client.set).bind(client);
    return setAsync(db, data);
}
exports.save = save;
async function read(db) {
    const getAsync = util_1.promisify(client.get).bind(client);
    const val = await getAsync(db);
    return JSON.parse(val);
}
exports.read = read;
function drop(db) {
    const delAsync = util_1.promisify(client.del).bind(client);
    return delAsync(db);
}
exports.drop = drop;
function close() {
    if (!client) {
        return;
    }
    if (client.connected) {
        client.end(true);
    }
}
exports.close = close;
