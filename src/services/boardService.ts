// server/src/services/boardService.ts
import prisma from "../prisma/prismaClient";

interface CreateBoardInput {
  title: string;
  userId: number; // passed from frontend/auth context
}

interface UpdateBoardInput {
  title?: string;
}

export const getBoards = async (userId: number) => {
  return await prisma.board.findMany({
    where: { ownerId: userId },
    include: { tasks: true, members: true },
    orderBy: { createdAt: "desc" },
  });
};

export const getBoardById = async (boardId: number, userId: number) => {
  return await prisma.board.findFirst({
    where: { id: boardId, ownerId: userId },
    include: { tasks: true, members: true },
  });
};

export const createBoard = async (data: CreateBoardInput) => {
  return await prisma.board.create({
    data: {
      title: data.title,
      ownerId: data.userId,
    },
    include: { tasks: true, members: true },
  });
};

export const updateBoard = async (
  boardId: number,
  userId: number,
  data: UpdateBoardInput
) => {
  return await prisma.board.updateMany({
    where: { id: boardId, ownerId: userId },
    data: { ...data },
  });
};

export const deleteBoard = async (boardId: number, userId: number) => {
  return await prisma.board.deleteMany({
    where: { id: boardId, ownerId: userId },
  });
};
