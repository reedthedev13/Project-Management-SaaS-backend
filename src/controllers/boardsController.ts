import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";

const prisma = new PrismaClient();

// ----------------------
// CREATE Board
// ----------------------
export const createBoard = async (req: AuthRequest, res: Response) => {
  const { title, description } = req.body; // title instead of name
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const newBoard = await prisma.board.create({
      data: {
        title,
        ownerId: userId,
      },
    });
    res.status(201).json(newBoard);
  } catch (error) {
    console.error("Create board error:", error);
    res.status(500).json({ error: "Failed to create board" });
  }
};

// ----------------------
// READ Boards for user
// ----------------------
export const getBoardsForUser = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const boards = await prisma.board.findMany({
      where: {
        OR: [
          { ownerId: userId }, // Boards user owns
          { members: { some: { id: userId } } }, // Boards user is a member of
        ],
      },
      include: {
        members: true,
        tasks: true,
      },
    });
    res.json(boards);
  } catch (error) {
    console.error("Get boards error:", error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
};

// ----------------------
// UPDATE Board
// ----------------------
export const updateBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;
  const { title } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
      include: { members: true },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    const isOwner = board.ownerId === userId;
    const isMember = board.members.some((m) => m.id === userId);

    if (!isOwner && !isMember)
      return res
        .status(403)
        .json({ error: "Not authorized to update this board" });

    const updatedBoard = await prisma.board.update({
      where: { id: Number(boardId) },
      data: { title },
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

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
    });

    if (!board) return res.status(404).json({ error: "Board not found" });
    if (board.ownerId !== userId)
      return res.status(403).json({ error: "Not authorized" });

    await prisma.board.delete({ where: { id: Number(boardId) } });

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

    await prisma.board.update({
      where: { id: Number(boardId) },
      data: {
        members: { connect: { id: memberId } }, // Use relation connect
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
    await prisma.board.update({
      where: { id: Number(boardId) },
      data: {
        members: { disconnect: { id: Number(memberId) } }, // Use relation disconnect
      },
    });

    res.json({ message: "Member removed" });
  } catch (error) {
    console.error("Remove member error:", error);
    res.status(500).json({ error: "Failed to remove member" });
  }
};

// ----------------------
// GET single board by ID
// ----------------------
export const getBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
      include: { members: true, tasks: true }, // include members and tasks if needed
    });

    if (!board) return res.status(404).json({ error: "Board not found" });

    res.json(board);
  } catch (error) {
    console.error("Get board error:", error);
    res.status(500).json({ error: "Failed to get board" });
  }
};
