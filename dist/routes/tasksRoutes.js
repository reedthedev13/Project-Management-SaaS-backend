"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tasksController_1 = require("../controllers/tasksController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validators_1 = require("../middleware/validators");
const asyncHandler_1 = require("../middleware/asyncHandler");
const router = (0, express_1.Router)();
// GET tasks by board
router.get("/", authMiddleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(tasksController_1.getTasksByBoard));
// POST create new task with validation
router.post("/", authMiddleware_1.authenticate, (0, validators_1.validate)(validators_1.createTaskSchema), (0, asyncHandler_1.asyncHandler)(tasksController_1.createTask));
// PUT update task with validation
router.put("/:taskId", authMiddleware_1.authenticate, (0, validators_1.validate)(validators_1.updateTaskSchema), (0, asyncHandler_1.asyncHandler)(tasksController_1.updateTask));
// DELETE task
router.delete("/:taskId", authMiddleware_1.authenticate, (0, asyncHandler_1.asyncHandler)(tasksController_1.deleteTask));
exports.default = router;
