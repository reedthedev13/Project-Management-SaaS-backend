"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoard = exports.updateBoard = exports.createBoard = exports.getBoardById = exports.getBoards = void 0;
// server/src/services/boardService.ts
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const getBoards = async (userId) => {
    return await prismaClient_1.default.board.findMany({
        where: { ownerId: userId },
        include: { tasks: true, members: true },
        orderBy: { createdAt: "desc" },
    });
};
exports.getBoards = getBoards;
const getBoardById = async (boardId, userId) => {
    return await prismaClient_1.default.board.findFirst({
        where: { id: boardId, ownerId: userId },
        include: { tasks: true, members: true },
    });
};
exports.getBoardById = getBoardById;
const createBoard = async (data) => {
    return await prismaClient_1.default.board.create({
        data: {
            title: data.title,
            ownerId: data.userId,
        },
        include: { tasks: true, members: true },
    });
};
exports.createBoard = createBoard;
const updateBoard = async (boardId, userId, data) => {
    return await prismaClient_1.default.board.updateMany({
        where: { id: boardId, ownerId: userId },
        data: { ...data },
    });
};
exports.updateBoard = updateBoard;
const deleteBoard = async (boardId, userId) => {
    return await prismaClient_1.default.board.deleteMany({
        where: { id: boardId, ownerId: userId },
    });
};
exports.deleteBoard = deleteBoard;
