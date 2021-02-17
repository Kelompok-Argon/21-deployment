"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhotoSvc = exports.removeSvc = exports.infoSvc = exports.listSvc = exports.registerSvc = void 0;
const Busboy = require("busboy");
const url = require("url");
const mime = require("mime-types");
const stream_1 = require("stream");
const worker_1 = require("./worker");
const storage_1 = require("../lib/storage");
function registerSvc(req, res) {
    const busboy = new Busboy({ headers: req.headers });
    const data = {
        name: '',
        age: 0,
        bio: '',
        address: '',
        photo: '',
    };
    let finished = false;
    function abort() {
        req.unpipe(busboy);
        if (!req.aborted) {
            res.statusCode = 413;
            res.end();
        }
    }
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        switch (fieldname) {
            case 'photo':
                try {
                    data.photo = await storage_1.saveFile(file, mimetype);
                }
                catch (err) {
                    abort();
                }
                if (!req.aborted && finished) {
                    try {
                        const worker = await worker_1.register(data);
                        res.setHeader('content-type', 'application/json');
                        res.write(JSON.stringify(worker));
                    }
                    catch (err) {
                        if (err === worker_1.ERROR_REGISTER_DATA_INVALID) {
                            res.statusCode = 401;
                        }
                        else {
                            res.statusCode = 500;
                        }
                        res.write(err);
                    }
                    res.end();
                }
                break;
            default: {
                const noop = new stream_1.Writable({
                    write(chunk, encding, callback) {
                        setImmediate(callback);
                    },
                });
                file.pipe(noop);
            }
        }
    });
    busboy.on('field', (fieldname, val) => {
        if (['name', 'age', 'bio', 'address'].includes(fieldname)) {
            data[fieldname] = val;
        }
    });
    busboy.on('finish', () => {
        finished = true;
    });
    req.on('aborted', abort);
    busboy.on('error', abort);
    req.pipe(busboy);
}
exports.registerSvc = registerSvc;
async function listSvc(req, res) {
    try {
        const workers = await worker_1.list();
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(workers));
        res.end();
    }
    catch (err) {
        res.statusCode = 500;
        res.end();
        return;
    }
}
exports.listSvc = listSvc;
async function infoSvc(req, res) {
    const uri = url.parse(req.url, true);
    const id = uri.query['id'];
    if (!id) {
        res.statusCode = 401;
        res.write('parameter id tidak ditemukan');
        res.end();
        return;
    }
    try {
        const worker = await worker_1.info(id);
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(worker));
        res.end();
    }
    catch (err) {
        if (err === worker_1.ERROR_WORKER_NOT_FOUND) {
            res.statusCode = 404;
            res.write(err);
            res.end();
            return;
        }
        res.statusCode = 500;
        res.end();
        return;
    }
}
exports.infoSvc = infoSvc;
async function removeSvc(req, res) {
    const uri = url.parse(req.url, true);
    const id = uri.query['id'];
    if (!id) {
        res.statusCode = 401;
        res.write('parameter id tidak ditemukan');
        res.end();
        return;
    }
    try {
        const worker = await worker_1.remove(id);
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        res.write(JSON.stringify(worker));
        res.end();
    }
    catch (err) {
        if (err === worker_1.ERROR_WORKER_NOT_FOUND) {
            res.statusCode = 404;
            res.write(err);
            res.end();
            return;
        }
        res.statusCode = 500;
        res.end();
        return;
    }
}
exports.removeSvc = removeSvc;
async function getPhotoSvc(req, res) {
    const uri = url.parse(req.url, true);
    const objectName = uri.pathname.replace('/photo/', '');
    if (!objectName) {
        res.statusCode = 400;
        res.write('request tidak sesuai');
        res.end();
    }
    try {
        const objectRead = await storage_1.readFile(objectName);
        res.setHeader('Content-Type', mime.lookup(objectName));
        res.statusCode = 200;
        objectRead.pipe(res);
    }
    catch (err) {
        if (err === storage_1.ERROR_FILE_NOT_FOUND) {
            res.statusCode = 404;
            res.write(err);
            res.end();
            return;
        }
        res.statusCode = 500;
        res.write('gagal membaca file');
        res.end();
        return;
    }
}
exports.getPhotoSvc = getPhotoSvc;
