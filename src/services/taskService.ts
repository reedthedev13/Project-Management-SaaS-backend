// server/src/services/taskService.ts
import prisma from "../prisma/prismaClient";

interface CreateTaskInput {
  title: string;
  boardId: number;
  description?: string;
  assigneeId?: number;
}

interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: string;
  assigneeId?: number | null;
}

export const getTasksByBoard = async (boardId: number) => {
  return await prisma.task.findMany({
    where: { boardId },
    orderBy: { createdAt: "asc" },
  });
};

export const createTask = async (data: CreateTaskInput) => {
  return await prisma.task.create({
    data: {
      title: data.title,
      boardId: data.boardId,
      description: data.description,
      assigneeId: data.assigneeId,
    },
  });
};

export const updateTask = async (taskId: number, data: UpdateTaskInput) => {
  return await prisma.task.update({
    where: { id: taskId },
    data: { ...data },
  });
};

export const deleteTask = async (taskId: number) => {
  return await prisma.task.delete({
    where: { id: taskId },
  });
};
