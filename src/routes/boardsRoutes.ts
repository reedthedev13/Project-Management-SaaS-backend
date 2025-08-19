import { Router } from "express";
import { authenticate } from "../middleware/authMiddleware";
import {
  createBoard,
  getBoardsForUser,
  updateBoard,
  deleteBoard,
} from "../controllers/boardsController";

const router = Router();

// Get all boards for logged-in user
router.get("/", authenticate, getBoardsForUser);

// Get single board by ID
router.get("/:boardId", authenticate);

// Create new board
router.post("/", authenticate, createBoard);

// Update board
router.put("/:boardId", authenticate, updateBoard);

// Delete board
router.delete("/:boardId", authenticate, deleteBoard);

// Add member
router.post("/:boardId/members", authenticate);

// Remove member
router.delete("/:boardId/members/:memberId", authenticate);

export default router;
