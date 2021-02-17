"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.list = exports.cancel = exports.done = exports.add = exports.ERROR_TASK_ALREADY_DONE = exports.ERROR_TASK_NOT_FOUND = exports.ERROR_TASK_DATA_INVALID = void 0;
const typeorm_1 = require("typeorm");
const workerClient = require("./worker.client");
const bus = require("../lib/bus");
exports.ERROR_TASK_DATA_INVALID = 'data pekerjaan baru tidak lengkap';
exports.ERROR_TASK_NOT_FOUND = 'pekerjaan tidak ditemukan';
exports.ERROR_TASK_ALREADY_DONE = 'pekerjaan sudah selesai';
async function add(data) {
    if (!data.job || !data.assigneeId) {
        throw exports.ERROR_TASK_DATA_INVALID;
    }
    await workerClient.info(data.assigneeId);
    const taskRepo = typeorm_1.getConnection().getRepository('Task');
    const newTask = await taskRepo.save({
        job: data.job,
        assignee: { id: data.assigneeId },
        attachment: data.attachment,
    });
    const task = await taskRepo.findOne(newTask.id, { relations: ['assignee'] });
    if (!task) {
        throw exports.ERROR_TASK_NOT_FOUND;
    }
    bus.publish('task.added', task);
    return task;
}
exports.add = add;
async function done(id) {
    const taskRepo = typeorm_1.getConnection().getRepository('Task');
    const task = await taskRepo.findOne(id, { relations: ['assignee'] });
    if (!task || (task === null || task === void 0 ? void 0 : task.cancelled)) {
        throw exports.ERROR_TASK_NOT_FOUND;
    }
    if (task.done) {
        throw exports.ERROR_TASK_ALREADY_DONE;
    }
    task.done = true;
    await taskRepo.save(task);
    bus.publish('task.done', task);
    return task;
}
exports.done = done;
async function cancel(id) {
    const taskRepo = typeorm_1.getConnection().getRepository('Task');
    const task = await taskRepo.findOne(id, { relations: ['assignee'] });
    if (!task || (task === null || task === void 0 ? void 0 : task.cancelled)) {
        throw exports.ERROR_TASK_NOT_FOUND;
    }
    task.cancelled = true;
    await taskRepo.save(task);
    bus.publish('task.cancelled', task);
    return task;
}
exports.cancel = cancel;
function list() {
    const taskRepo = typeorm_1.getConnection().getRepository('Task');
    return taskRepo.find({ relations: ['assignee'] });
}
exports.list = list;
