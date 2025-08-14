import { Router } from "express";
import {
  getTasksByBoard,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/tasksController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// GET tasks by board
router.get("/board/:boardId", authenticate, getTasksByBoard);

// POST create new task
router.post("/", authenticate, createTask);

// PUT update task
router.put("/:taskId", authenticate, updateTask);

// DELETE task
router.delete("/:taskId", authenticate, deleteTask);

export default router;
