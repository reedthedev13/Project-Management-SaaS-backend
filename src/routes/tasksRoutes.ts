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

const router = Router();

// GET tasks by board
router.get("/", authenticate, getTasksByBoard);

// POST create new task with validation
router.post("/", authenticate, validate(createTaskSchema), createTask);

// PUT update task with validation
router.put("/:taskId", authenticate, validate(updateTaskSchema), updateTask);

// DELETE task
router.delete("/:taskId", authenticate, deleteTask);

export default router;
