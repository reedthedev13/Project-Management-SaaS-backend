"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoard = exports.updateBoard = exports.createBoard = exports.getBoardsForUser = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
// ----------------------
// GET boards for user
// ----------------------
const getBoardsForUser = async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const boards = await prismaClient_1.default.board.findMany({
            where: { ownerId: req.userId },
            include: {
                tasks: true,
            },
        });
        return res.status(200).json(boards);
    }
    catch (error) {
        console.error("Get boards error:", error);
        return res.status(500).json({ error: "Failed to fetch boards" });
    }
};
exports.getBoardsForUser = getBoardsForUser;
// ----------------------
// CREATE board
// ----------------------
const createBoard = async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    const { title } = req.body;
    if (!title)
        return res.status(400).json({ error: "Title is required" });
    try {
        const board = await prismaClient_1.default.board.create({
            data: {
                title,
                ownerId: req.userId,
            },
            include: { tasks: true },
        });
        return res.status(201).json(board);
    }
    catch (error) {
        console.error("Create board error:", error);
        return res.status(500).json({ error: "Failed to create board" });
    }
};
exports.createBoard = createBoard;
// ----------------------
// UPDATE board
// ----------------------
const updateBoard = async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;
    if (!boardId || isNaN(Number(boardId)))
        return res.status(400).json({ error: "Invalid boardId" });
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const board = await prismaClient_1.default.board.update({
            where: { id: Number(boardId) },
            data: { ...(title && { title }) },
        });
        return res.status(200).json(board);
    }
    catch (error) {
        console.error("Update board error:", error);
        return res.status(500).json({ error: "Failed to update board" });
    }
};
exports.updateBoard = updateBoard;
// ----------------------
// DELETE board
// ----------------------
const deleteBoard = async (req, res) => {
    const { boardId } = req.params;
    if (!boardId || isNaN(Number(boardId)))
        return res.status(400).json({ error: "Invalid boardId" });
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const id = Number(boardId);
        await prismaClient_1.default.task.deleteMany({
            where: { boardId: id },
        });
        await prismaClient_1.default.board.delete({
            where: { id },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Delete board error:", error);
        return res.status(500).json({ error: "Failed to delete board" });
    }
};
exports.deleteBoard = deleteBoard;
