"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stop = exports.run = void 0;
const bus = require("../lib/bus");
const performance_1 = require("./performance");
let increaseTotalTaskSub;
let increaseDoneTaskSub;
let increaseCancelledTaskSub;
let increaseTotalWorkerSub;
let decreaseTotalWorkerSub;
function run() {
    increaseTotalTaskSub = bus.subscribe('task.added', performance_1.increaseTotalTask);
    increaseDoneTaskSub = bus.subscribe('task.done', performance_1.increaseDoneTask);
    increaseCancelledTaskSub = bus.subscribe('task.cancelled', performance_1.increaseCancelledTask);
    increaseTotalWorkerSub = bus.subscribe('worker.registered', performance_1.increaseTotalWorker);
    decreaseTotalWorkerSub = bus.subscribe('worker.removed', performance_1.decreaseTotalWorker);
}
exports.run = run;
function stop() {
    if (increaseTotalTaskSub) {
        bus.unsubscribe(increaseTotalTaskSub);
    }
    if (increaseDoneTaskSub) {
        bus.unsubscribe(increaseDoneTaskSub);
    }
    if (increaseCancelledTaskSub) {
        bus.unsubscribe(increaseCancelledTaskSub);
    }
    if (increaseTotalWorkerSub) {
        bus.unsubscribe(increaseTotalWorkerSub);
    }
    if (decreaseTotalWorkerSub) {
        bus.unsubscribe(decreaseTotalWorkerSub);
    }
}
exports.stop = stop;
