"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const orm = require("./lib/orm");
const storage = require("./lib/storage");
const kv = require("./lib/kv");
const bus = require("./lib/bus");
const task_model_1 = require("./tasks/task.model");
const worker_model_1 = require("./worker/worker.model");
const workerServer = require("./worker/server");
const tasksServer = require("./tasks/server");
const performanceServer = require("./performance/server");
const config_1 = require("./config");
async function init() {
    try {
        console.log('connect to database');
        await orm.connect([worker_model_1.WorkerSchema, task_model_1.TaskSchema], config_1.config.database);
        console.log('database connected');
    }
    catch (err) {
        console.error('database connection failed');
        process.exit(1);
    }
    try {
        console.log('connect to object storage');
        await storage.connect('task-manager', config_1.config.objectStorage);
        console.log('object storage connected');
    }
    catch (err) {
        console.error('object storage connection failed');
        process.exit(1);
    }
    try {
        console.log('connect to message bus');
        await bus.connect();
        console.log('message bus connected');
    }
    catch (err) {
        console.error('message bus connection failed');
        process.exit(1);
    }
    try {
        console.log('connect to key value store');
        await kv.connect();
        console.log('key value store connected');
    }
    catch (err) {
        console.error('key value store connection failed');
        process.exit(1);
    }
}
async function onStop() {
    bus.close();
    kv.close();
}
async function main(command) {
    switch (command) {
        case 'performance':
            await init();
            performanceServer.run(onStop);
            break;
        case 'task':
            await init();
            tasksServer.run(onStop);
            break;
        case 'worker':
            await init();
            workerServer.run(onStop);
            break;
        default:
            console.log(`${command} tidak dikenali`);
            console.log('command yang valid: task, worker, performance');
    }
}
main(process.argv[2]);