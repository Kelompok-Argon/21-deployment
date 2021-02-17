"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAttachmentSvc = exports.cancelSvc = exports.doneSvc = exports.listSvc = exports.addSvc = void 0;
const Busboy = require("busboy");
const url = require("url");
const mime = require("mime-types");
const stream_1 = require("stream");
const task_1 = require("./task");
const storage_1 = require("../lib/storage");
function addSvc(req, res) {
    const busboy = new Busboy({ headers: req.headers });
    const data = {
        job: '',
        assigneeId: 0,
        attachment: null,
    };
    let finished = false;
    function abort() {
        req.unpipe(busboy);
        if (!req.aborted) {
            res.statusCode = 500;
            res.write('internal server error');
            res.end();
        }
    }
    busboy.on('file', async (fieldname, file, filename, encoding, mimetype) => {
        switch (fieldname) {
            case 'attachment':
                try {
                    data.attachment = await storage_1.saveFile(file, mimetype);
                }
                catch (err) {
                    abort();
                }
                if (!req.aborted && finished) {
                    try {
                        const task = await task_1.add(data);
                        res.setHeader('content-type', 'application/json');
                        res.write(JSON.stringify(task));
                    }
                    catch (err) {
                        if (err === task_1.ERROR_TASK_DATA_INVALID) {
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
        switch (fieldname) {
            case 'job':
                data.job = val;
                break;
            case 'assignee_id':
                data.assigneeId = parseInt(val, 10);
                break;
        }
    });
    busboy.on('finish', async () => {
        finished = true;
    });
    req.on('aborted', abort);
    busboy.on('error', abort);
    req.pipe(busboy);
}
exports.addSvc = addSvc;
async function listSvc(req, res) {
    try {
        const tasks = await task_1.list();
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(tasks));
        res.end();
    }
    catch (err) {
        res.statusCode = 500;
        res.end();
        return;
    }
}
exports.listSvc = listSvc;
async function doneSvc(req, res) {
    const uri = url.parse(req.url, true);
    const id = uri.query['id'];
    if (!id) {
        res.statusCode = 401;
        res.write('parameter id tidak ditemukan');
        res.end();
        return;
    }
    try {
        const task = await task_1.done(parseInt(id, 10));
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        res.write(JSON.stringify(task));
        res.end();
    }
    catch (err) {
        if (err === task_1.ERROR_TASK_NOT_FOUND) {
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
exports.doneSvc = doneSvc;
async function cancelSvc(req, res) {
    const uri = url.parse(req.url, true);
    const id = uri.query['id'];
    if (!id) {
        res.statusCode = 401;
        res.write('parameter id tidak ditemukan');
        res.end();
        return;
    }
    try {
        const task = await task_1.cancel(parseInt(id, 10));
        res.setHeader('content-type', 'application/json');
        res.statusCode = 200;
        res.write(JSON.stringify(task));
        res.end();
    }
    catch (err) {
        if (err === task_1.ERROR_TASK_NOT_FOUND) {
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
exports.cancelSvc = cancelSvc;
async function getAttachmentSvc(req, res) {
    const uri = url.parse(req.url, true);
    const objectName = uri.pathname.replace('/attachment/', '');
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
exports.getAttachmentSvc = getAttachmentSvc;
