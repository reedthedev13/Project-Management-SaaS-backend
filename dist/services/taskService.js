"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasksByBoard = void 0;
// server/src/services/taskService.ts
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const getTasksByBoard = async (boardId) => {
    return await prismaClient_1.default.task.findMany({
        where: { boardId },
        orderBy: { createdAt: "asc" },
    });
};
exports.getTasksByBoard = getTasksByBoard;
const createTask = async (data) => {
    return await prismaClient_1.default.task.create({
        data: {
            title: data.title,
            boardId: data.boardId,
            description: data.description,
            assigneeId: data.assigneeId,
        },
    });
};
exports.createTask = createTask;
const updateTask = async (taskId, data) => {
    return await prismaClient_1.default.task.update({
        where: { id: taskId },
        data: { ...data },
    });
};
exports.updateTask = updateTask;
const deleteTask = async (taskId) => {
    return await prismaClient_1.default.task.delete({
        where: { id: taskId },
    });
};
exports.deleteTask = deleteTask;
