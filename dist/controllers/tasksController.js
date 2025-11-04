"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasksByBoard = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
// ----------------------
// GET tasks by board
// ----------------------
const getTasksByBoard = async (req, res) => {
    const boardId = Number(req.query.boardId);
    if (!boardId || isNaN(boardId)) {
        return res.status(400).json({ error: "Valid boardId is required" });
    }
    try {
        const board = await prismaClient_1.default.board.findUnique({
            where: { id: boardId },
            include: { tasks: true }, // <-- include tasks with their completed status
        });
        if (!board)
            return res.status(404).json({ error: "Board not found" });
        // Return tasks directly with their completed state
        return res.status(200).json(board.tasks);
    }
    catch (err) {
        console.error("Fetch tasks by board error:", err);
        return res.status(500).json({ error: "Failed to fetch tasks" });
    }
};
exports.getTasksByBoard = getTasksByBoard;
// ----------------------
// CREATE task
// ----------------------
const createTask = async (req, res) => {
    const { title, boardId, description, status, assigneeId } = req.body;
    if (!title || !boardId) {
        return res.status(400).json({ error: "Title and boardId are required" });
    }
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const board = await prismaClient_1.default.board.findUnique({
            where: { id: Number(boardId) },
        });
        if (!board)
            return res.status(404).json({ error: "Board not found" });
        const newTask = await prismaClient_1.default.task.create({
            data: {
                title,
                description: description || null,
                status: status || "todo",
                boardId: Number(boardId),
                assigneeId: assigneeId || null,
            },
        });
        return res.status(201).json(newTask);
    }
    catch (error) {
        console.error("Create task error:", error);
        return res.status(500).json({ error: "Failed to create task" });
    }
};
exports.createTask = createTask;
// ----------------------
// UPDATE task
// ----------------------
// controllers/tasksController.ts
const updateTask = async (req, res) => {
    const { taskId } = req.params;
    const { completed } = req.body;
    if (!taskId || isNaN(Number(taskId)))
        return res.status(400).json({ error: "Invalid taskId" });
    try {
        const updatedTask = await prismaClient_1.default.task.update({
            where: { id: Number(taskId) },
            data: { completed },
        });
        return res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error("Update task error:", error); // <- this is likely why you see 500
        return res.status(500).json({ error: "Failed to update task" });
    }
};
exports.updateTask = updateTask;
// ----------------------
// DELETE task
// ----------------------
const deleteTask = async (req, res) => {
    const { taskId } = req.params;
    if (!taskId || isNaN(Number(taskId))) {
        return res.status(400).json({ error: "Invalid taskId" });
    }
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        await prismaClient_1.default.task.delete({
            where: { id: Number(taskId) },
        });
        return res.status(200).json({ message: "Task deleted" });
    }
    catch (error) {
        console.error("Delete task error:", error);
        return res.status(500).json({ error: "Failed to delete task" });
    }
};
exports.deleteTask = deleteTask;
