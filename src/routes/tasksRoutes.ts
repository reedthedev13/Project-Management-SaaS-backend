import { Router } from "express";
import {
  getTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController";
import { authenticate } from "../middleware/authMiddleware";
import {
  validate,
  createTaskSchema,
  updateTaskSchema,
} from "../middleware/validators";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

// GET tasks by board
router.get("/", authenticate, asyncHandler(getTasksByBoard));

// POST create new task with validation
router.post(
  "/",
  authenticate,
  validate(createTaskSchema),
  asyncHandler(createTask)
);

// PUT update task with validation
router.put(
  "/:taskId",
  authenticate,
  validate(updateTaskSchema),
  asyncHandler(updateTask)
);

// DELETE task
router.delete("/:taskId", authenticate, asyncHandler(deleteTask));

export default router;
