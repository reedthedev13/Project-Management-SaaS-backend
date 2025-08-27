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
      include: {
        tasks: true,
      },
    });
    return res.status(200).json(boards);
  } catch (error) {
    console.error("Get boards error:", error);
    return res.status(500).json({ error: "Failed to fetch boards" });
  }
};

// ----------------------
// CREATE board
// ----------------------
export const createBoard = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });

  try {
    const board = await prisma.board.create({
      data: {
        title,
        ownerId: req.userId,
      },
    });
    return res.status(201).json(board);
  } catch (error) {
    console.error("Create board error:", error);
    return res.status(500).json({ error: "Failed to create board" });
  }
};

// ----------------------
// UPDATE board
// ----------------------
export const updateBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;
  const { title } = req.body;

  if (!boardId || isNaN(Number(boardId)))
    return res.status(400).json({ error: "Invalid boardId" });
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const board = await prisma.board.update({
      where: { id: Number(boardId) },
      data: { ...(title && { title }) },
    });
    return res.status(200).json(board);
  } catch (error) {
    console.error("Update board error:", error);
    return res.status(500).json({ error: "Failed to update board" });
  }
};

// ----------------------
// DELETE board
// ----------------------
export const deleteBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;

  if (!boardId || isNaN(Number(boardId)))
    return res.status(400).json({ error: "Invalid boardId" });
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await prisma.board.delete({
      where: { id: Number(boardId) },
    });
    return res.status(204).send();
  } catch (error) {
    console.error("Delete board error:", error);
    return res.status(500).json({ error: "Failed to delete board" });
  }
};
