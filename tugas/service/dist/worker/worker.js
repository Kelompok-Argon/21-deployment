"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.info = exports.list = exports.register = exports.ERROR_WORKER_NOT_FOUND = exports.ERROR_REGISTER_DATA_INVALID = void 0;
const typeorm_1 = require("typeorm");
const worker_model_1 = require("./worker.model");
const bus = require("../lib/bus");
exports.ERROR_REGISTER_DATA_INVALID = 'data registrasi pekerja tidak lengkap';
exports.ERROR_WORKER_NOT_FOUND = 'pekerja tidak ditemukan';
async function register(data) {
    if (!data.name || !data.age || !data.bio || !data.address || !data.photo) {
        throw exports.ERROR_REGISTER_DATA_INVALID;
    }
    const workerRepo = typeorm_1.getConnection().getRepository('Worker');
    const worker = new worker_model_1.Worker(null, data.name, parseInt(data.age, 10), data.bio, data.address, data.photo);
    await workerRepo.save(worker);
    bus.publish('worker.registered', worker);
    return worker;
}
exports.register = register;
function list() {
    const workerRepo = typeorm_1.getConnection().getRepository('Worker');
    return workerRepo.find();
}
exports.list = list;
async function info(id) {
    const workerRepo = typeorm_1.getConnection().getRepository('Worker');
    const worker = await workerRepo.findOne(id);
    if (!worker) {
        throw exports.ERROR_WORKER_NOT_FOUND;
    }
    return worker;
}
exports.info = info;
async function remove(id) {
    const workerRepo = typeorm_1.getConnection().getRepository('Worker');
    const worker = await workerRepo.findOne(id);
    if (!worker) {
        throw exports.ERROR_WORKER_NOT_FOUND;
    }
    await workerRepo.delete(id);
    bus.publish('worker.removed', worker);
    return worker;
}
exports.remove = remove;
// module.exports = {
//   register,
//   list,
//   remove,
//   info,
//   ERROR_REGISTER_DATA_INVALID,
//   ERROR_WORKER_NOT_FOUND,
// };
