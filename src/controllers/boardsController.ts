import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../prisma/prismaClient";

// ----------------------
// GET boards for user
// ----------------------
export const getBoardsForUser = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const boards = await prisma.board.findMany({
      where: { ownerId: req.userId },
      include: { tasks: true },
    });
    res.status(200).json(boards);
  } catch (err) {
    console.error("Get boards error:", err);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
};

// ----------------------
// CREATE board
// ----------------------
export const createBoard = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  const { title } = req.body as { title?: string };
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const board = await prisma.board.create({
      data: { title, ownerId: req.userId },
      include: { tasks: true },
    });
    res.status(201).json(board);
  } catch (err) {
    console.error("Create board error:", err);
    res.status(500).json({ error: "Failed to create board" });
  }
};

// ----------------------
// UPDATE board
// ----------------------
export const updateBoard = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  const boardId = Number(req.params.boardId);
  const { title } = req.body as { title?: string };

  if (!boardId || isNaN(boardId))
    return res.status(400).json({ error: "Invalid boardId" });

  try {
    const board = await prisma.board.update({
      where: { id: boardId },
      data: { ...(title && { title }) },
    });
    res.status(200).json(board);
  } catch (err) {
    console.error("Update board error:", err);
    res.status(500).json({ error: "Failed to update board" });
  }
};

// ----------------------
// DELETE board
// ----------------------
export const deleteBoard = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  const boardId = Number(req.params.boardId);
  if (!boardId || isNaN(boardId))
    return res.status(400).json({ error: "Invalid boardId" });

  try {
    // Delete all tasks for this board
    await prisma.task.deleteMany({ where: { boardId } });

    // Delete the board
    await prisma.board.delete({ where: { id: boardId } });

    res.status(204).send();
  } catch (err) {
    console.error("Delete board error:", err);
    res.status(500).json({ error: "Failed to delete board" });
  }
};
