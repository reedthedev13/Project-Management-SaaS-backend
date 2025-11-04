"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const boardsController_1 = require("../controllers/boardsController");
const validators_1 = require("../middleware/validators");
const boardsSchema_1 = require("../middleware/boardsSchema");
const router = (0, express_1.Router)();
// Get all boards for logged-in user
router.get("/", authMiddleware_1.authenticate, boardsController_1.getBoardsForUser);
// Get single board by ID
router.get("/:boardId", authMiddleware_1.authenticate);
// Create new board with validation
router.post("/", authMiddleware_1.authenticate, (0, validators_1.validate)(boardsSchema_1.createBoardSchema), boardsController_1.createBoard);
// Update board with validation
router.put("/:boardId", authMiddleware_1.authenticate, (0, validators_1.validate)(boardsSchema_1.updateBoardSchema), boardsController_1.updateBoard);
// Delete board
router.delete("/:boardId", authMiddleware_1.authenticate, boardsController_1.deleteBoard);
// Add member
router.post("/:boardId/members", authMiddleware_1.authenticate);
// Remove member
router.delete("/:boardId/members/:memberId", authMiddleware_1.authenticate);
exports.default = router;
