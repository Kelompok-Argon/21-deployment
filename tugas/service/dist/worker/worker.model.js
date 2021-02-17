"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerSchema = exports.Worker = void 0;
const typeorm_1 = require("typeorm");
class Worker {
    constructor(id, name, age, bio, address, photo) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.bio = bio;
        this.address = address;
        this.photo = photo;
    }
}
exports.Worker = Worker;
exports.WorkerSchema = new typeorm_1.EntitySchema({
    name: 'Worker',
    target: Worker,
    tableName: 'workers',
    columns: {
        id: {
            type: 'int',
            primary: true,
            generated: true,
        },
        name: {
            type: 'varchar',
            length: 255,
        },
        age: {
            type: 'int',
        },
        bio: {
            type: 'text',
        },
        address: {
            type: 'text',
        },
        photo: {
            type: 'varchar',
            length: 255,
        },
    },
});
