"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decreaseTotalWorker = exports.increaseTotalWorker = exports.increaseCancelledTask = exports.increaseDoneTask = exports.increaseTotalTask = exports.summary = void 0;
const kv_1 = require("../lib/kv");
const TASK_TOTAL_KEY = 'task.total';
const TASK_DONE_KEY = 'task.done';
const TASK_CANCELLED_KEY = 'task.cancelled';
const WORKER_TOTAL_KEY = 'worker.total';
async function summary() {
    const data = {
        total_task: parseInt((await kv_1.read(TASK_TOTAL_KEY)) || '0', 10),
        task_done: parseInt((await kv_1.read(TASK_DONE_KEY)) || '0', 10),
        task_cancelled: parseInt((await kv_1.read(TASK_CANCELLED_KEY)) || '0', 10),
        total_worker: parseInt((await kv_1.read(WORKER_TOTAL_KEY)) || '0', 10),
    };
    return data;
}
exports.summary = summary;
async function increaseTotalTask() {
    const raw = await kv_1.read(TASK_TOTAL_KEY);
    let val = parseInt(raw || '0', 10);
    val++;
    await kv_1.save(TASK_TOTAL_KEY, val);
}
exports.increaseTotalTask = increaseTotalTask;
async function increaseDoneTask() {
    const raw = await kv_1.read(TASK_DONE_KEY);
    let val = parseInt(raw || '0', 10);
    val++;
    await kv_1.save(TASK_DONE_KEY, val);
}
exports.increaseDoneTask = increaseDoneTask;
async function increaseCancelledTask() {
    const raw = await kv_1.read(TASK_CANCELLED_KEY);
    let val = parseInt(raw || '0', 10);
    val++;
    await kv_1.save(TASK_CANCELLED_KEY, val);
}
exports.increaseCancelledTask = increaseCancelledTask;
async function increaseTotalWorker() {
    const raw = await kv_1.read(WORKER_TOTAL_KEY);
    let val = parseInt(raw || '0', 10);
    val++;
    await kv_1.save(WORKER_TOTAL_KEY, val);
}
exports.increaseTotalWorker = increaseTotalWorker;
async function decreaseTotalWorker() {
    const raw = await kv_1.read(WORKER_TOTAL_KEY);
    let val = parseInt(raw || '0', 10);
    if (val > 0) {
        val--;
    }
    await kv_1.save(WORKER_TOTAL_KEY, val);
}
exports.decreaseTotalWorker = decreaseTotalWorker;
