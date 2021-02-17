"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.unsubscribe = exports.subscribe = exports.publish = exports.connect = void 0;
const nats = require("nats");
let client;
function connect(url, config) {
    return new Promise((resolve, reject) => {
        client = nats.connect(url, config);
        client.on('connect', () => {
            resolve();
        });
        client.on('error', (err) => {
            reject(err);
        });
    });
}
exports.connect = connect;
function publish(subject, data) {
    client.publish(subject, JSON.stringify(data));
}
exports.publish = publish;
function subscribe(subject, callback) {
    return client.subscribe(subject, callback);
}
exports.subscribe = subscribe;
function unsubscribe(sid) {
    return client.unsubscribe(sid);
}
exports.unsubscribe = unsubscribe;
function close() {
    if (!client) {
        return;
    }
    client.close();
}
exports.close = close;
