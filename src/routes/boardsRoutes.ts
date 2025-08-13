import express from "express";
import {
  updateBoard,
  deleteBoard,
  addBoardMember,
  removeBoardMember,
} from "../controllers/boardsController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.put("/:boardId", authenticate, updateBoard);
router.delete("/:boardId", authenticate, deleteBoard);
router.post("/:boardId/members", authenticate, addBoardMember);
router.delete("/:boardId/members/:memberId", authenticate, removeBoardMember);

export default router;
