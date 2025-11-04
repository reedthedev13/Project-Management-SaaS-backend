"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBoardSchema = exports.createBoardSchema = void 0;
const zod_1 = require("zod");
// For creating/updating a board
exports.createBoardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
});
exports.updateBoardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
});
