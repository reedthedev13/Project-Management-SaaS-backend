import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { BoardMember } from "../types/express/board";
import { AuthRequest } from "../middleware/authMiddleware";

const prisma = new PrismaClient();

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number }; // extend Request interface globally
    }
  }
}

// ----------------------
// CREATE Board
// ----------------------
export const createBoard = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  try {
    const newBoard = await prisma.board.create({
      data: {
        name,
        description,
        ownerId: userId!,
      },
    });
    res.status(201).json(newBoard);
  } catch (error) {
    console.error("Create board error:", error);
    res.status(500).json({ error: "Failed to create board" });
  }
};

// ----------------------
// READ (Get one board)
// ----------------------
export const getBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
      include: { members: true },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    res.json(board);
  } catch (error) {
    console.error("Get board error:", error);
    res.status(500).json({ error: "Failed to get board" });
  }
};

// ----------------------
// UPDATE Board
// ----------------------
export const updateBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;
  const { name, description } = req.body;
  const userId = req.user?.id;

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
      include: { members: true },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    const isOwner = board.ownerId === userId;
    const userIdNum = Number(userId);

    const isMember = board.members.some(
      (m: BoardMember) => m.userId! === Number(userId)
    );

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this board" });
    }

    const updatedBoard = await prisma.board.update({
      where: { id: Number(boardId) },
      data: { name, description },
    });

    res.json(updatedBoard);
  } catch (error) {
    console.error("Update board error:", error);
    res.status(500).json({ error: "Failed to update board" });
  }
};

// ----------------------
// DELETE Board
// ----------------------
export const deleteBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;
  const userId = req.user?.id;

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    if (board.ownerId !== userId) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this board" });
    }

    await prisma.board.delete({
      where: { id: Number(boardId) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Delete board error:", error);
    res.status(500).json({ error: "Failed to delete board" });
  }
};

// ----------------------
// ADD Board Member
// ----------------------
export const addBoardMember = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;
  const { memberId } = req.body;

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    await prisma.boardMember.create({
      data: {
        boardId: Number(boardId),
        userId: memberId,
      },
    });

    res.status(201).json({ message: "Member added" });
  } catch (error) {
    console.error("Add member error:", error);
    res.status(500).json({ error: "Failed to add member" });
  }
};

// ----------------------
// REMOVE Board Member
// ----------------------
export const removeBoardMember = async (req: AuthRequest, res: Response) => {
  const { boardId, memberId } = req.params;

  try {
    await prisma.boardMember.deleteMany({
      where: {
        boardId: Number(boardId),
        userId: Number(memberId),
      },
    });

    res.json({ message: "Member removed" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};
