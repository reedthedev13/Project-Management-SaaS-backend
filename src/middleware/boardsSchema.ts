import { z } from "zod";

// For creating/updating a board
export const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export const updateBoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
