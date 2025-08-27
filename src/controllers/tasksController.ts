import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../prisma/prismaClient";

// ----------------------
// GET tasks by board
// ----------------------
export const getTasksByBoard = async (req: AuthRequest, res: Response) => {
  const boardId = Number(req.query.boardId);

  if (!boardId || isNaN(boardId)) {
    return res.status(400).json({ error: "Valid boardId is required" });
  }

  try {
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: { tasks: true }, // <-- include tasks with their completed status
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    // Return tasks directly with their completed state
    return res.status(200).json(board.tasks);
  } catch (err) {
    console.error("Fetch tasks by board error:", err);
    return res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ----------------------
// CREATE task
// ----------------------
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, boardId, description, status, assigneeId } = req.body;

  if (!title || !boardId) {
    return res.status(400).json({ error: "Title and boardId are required" });
  }

  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const board = await prisma.board.findUnique({
      where: { id: Number(boardId) },
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const newTask = await prisma.task.create({
      data: {
        title,
        description: description || null,
        status: status || "todo",
        boardId: Number(boardId),
        assigneeId: assigneeId || null,
      },
    });

    return res.status(201).json(newTask);
  } catch (error) {
    console.error("Create task error:", error);
    return res.status(500).json({ error: "Failed to create task" });
  }
};

// ----------------------
// UPDATE task
// ----------------------
// controllers/tasksController.ts
export const updateTask = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { completed } = req.body;

  if (!taskId || isNaN(Number(taskId)))
    return res.status(400).json({ error: "Invalid taskId" });

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: { completed },
    });
    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error); // <- this is likely why you see 500
    return res.status(500).json({ error: "Failed to update task" });
  }
};

// ----------------------
// DELETE task
// ----------------------
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;

  if (!taskId || isNaN(Number(taskId))) {
    return res.status(400).json({ error: "Invalid taskId" });
  }

  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await prisma.task.delete({
      where: { id: Number(taskId) },
    });
    return res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    return res.status(500).json({ error: "Failed to delete task" });
  }
};
