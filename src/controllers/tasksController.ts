import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../prisma/prismaClient";

// ----------------------
// GET tasks by board
// ----------------------
export const getTasksByBoard = async (req: AuthRequest, res: Response) => {
  const { boardId } = req.params;
  try {
    const tasks = await prisma.task.findMany({
      where: { boardId: Number(boardId) },
      orderBy: { createdAt: "asc" },
    });
    res.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// ----------------------
// CREATE task
// ----------------------
export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, boardId } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        boardId: Number(boardId),
      },
    });
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

// ----------------------
// UPDATE task
// ----------------------
export const updateTask = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  const { title, description, status, assigneeId } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: { id: Number(taskId) },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(assigneeId !== undefined && { assigneeId }),
      },
    });
    res.json(updatedTask);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
};

// ----------------------
// DELETE task
// ----------------------
export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { taskId } = req.params;
  try {
    await prisma.task.delete({
      where: { id: Number(taskId) },
    });
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};
