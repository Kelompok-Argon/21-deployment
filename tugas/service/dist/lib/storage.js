"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.saveFile = exports.connect = exports.ERROR_FILE_NOT_FOUND = exports.ERROR_REQUIRE_OBJECT_NAME = void 0;
const mime = require("mime-types");
const minio_1 = require("minio");
exports.ERROR_REQUIRE_OBJECT_NAME = 'error wajib memasukan nama objek';
exports.ERROR_FILE_NOT_FOUND = 'error file tidak ditemukan';
let client;
let bucketname;
async function connect(_bucketname, options) {
    client = new minio_1.Client(Object.assign(Object.assign({}, options), { useSSL: false }));
    bucketname = _bucketname || 'photo';
    try {
        await client.makeBucket(bucketname);
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.code) === 'BucketAlreadyOwnedByYou') {
            return;
        }
        throw err;
    }
}
exports.connect = connect;
function randomFileName(mimetype) {
    return (new Date().getTime() +
        '-' +
        Math.round(Math.random() * 1000) +
        '.' +
        mime.extension(mimetype));
}
function saveFile(file, mimetype) {
    const objectName = randomFileName(mimetype);
    return new Promise((resolve, reject) => {
        client.putObject(bucketname, objectName, file, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(objectName);
        });
    });
}
exports.saveFile = saveFile;
async function readFile(objectName) {
    if (!objectName) {
        throw exports.ERROR_REQUIRE_OBJECT_NAME;
    }
    try {
        await client.statObject(bucketname, objectName);
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.code) === 'NotFound') {
            throw exports.ERROR_FILE_NOT_FOUND;
        }
        throw err;
    }
    return client.getObject(bucketname, objectName);
}
exports.readFile = readFile;
