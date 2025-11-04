"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = exports.loginSchema = exports.registerSchema = exports.updateBoardSchema = exports.createBoardSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.validate = void 0;
const zod_1 = require("zod");
const express_validator_1 = require("express-validator");
// Generic validator middleware
const validate = (schema) => {
    return (req, res, next) => {
        try {
            // For GET requests, validate query params; otherwise, validate body
            const data = req.method === "GET" ? req.query : req.body;
            // This throws if validation fails
            schema.parse(data);
            // If validation passes, continue
            next();
        }
        catch (err) {
            // Return a 400 with the Zod errors
            return res.status(400).json({ error: err.errors || err.message });
        }
    };
};
exports.validate = validate;
// Schema for creating a task
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required"),
    boardId: zod_1.z.number().int().positive("Valid boardId is required"),
});
// Schema for updating a task
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
    status: zod_1.z.enum(["pending", "in-progress", "completed"]).optional(),
});
// ----------------- Boards -----------------
exports.createBoardSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Board title is required"),
});
exports.updateBoardSchema = zod_1.z.object({
    title: zod_1.z.string().optional(),
});
// ----------------- Auth -----------------
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        // Return first error for simplicity, you can return all if you want
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};
exports.validateRequest = validateRequest;
