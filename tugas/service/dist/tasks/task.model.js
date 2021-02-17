"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = exports.Task = void 0;
const typeorm_1 = require("typeorm");
class Task {
    constructor(id, job, assignee, done, cancelled, attachment, addedAt) {
        this.job = job;
        this.assignee = assignee;
        this.done = done;
        this.cancelled = cancelled;
        this.attachment = attachment;
        this.addedAt = addedAt;
        this.id = id;
        this.job = job;
        this.done = done;
        this.cancelled = cancelled;
        this.addedAt = addedAt;
        this.attachment = attachment;
        this.assignee = assignee;
    }
}
exports.Task = Task;
exports.TaskSchema = new typeorm_1.EntitySchema({
    name: 'Task',
    tableName: 'tasks',
    target: Task,
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        job: {
            type: 'text',
        },
        done: {
            type: 'boolean',
            default: false,
        },
        cancelled: {
            type: 'boolean',
            default: false,
        },
        attachment: {
            type: 'varchar',
            length: 255,
            nullable: true,
        },
        addedAt: {
            type: 'timestamp',
            name: 'added_at',
            nullable: false,
            default: () => 'NOW()',
        },
    },
    relations: {
        assignee: {
            target: 'Worker',
            type: 'many-to-one',
            onDelete: 'CASCADE',
        },
    },
});
