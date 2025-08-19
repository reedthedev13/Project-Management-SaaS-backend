import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { z } from "zod";
import { validationResult } from "express-validator";

// Generic validator middleware
export const validate = (schema: ZodSchema<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // For GET requests, validate query params; otherwise, validate body
      const data = req.method === "GET" ? req.query : req.body;

      // This throws if validation fails
      schema.parse(data);

      // If validation passes, continue
      next();
    } catch (err: any) {
      // Return a 400 with the Zod errors
      return res.status(400).json({ error: err.errors || err.message });
    }
  };
};

// Schema for creating a task
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  boardId: z.number().int().positive("Valid boardId is required"),
});

// Schema for updating a task
export const updateTaskSchema = z.object({
  title: z.string().optional(),
  status: z.enum(["pending", "in-progress", "completed"]).optional(),
});

// ----------------- Boards -----------------
export const createBoardSchema = z.object({
  title: z.string().min(1, "Board title is required"),
});

export const updateBoardSchema = z.object({
  title: z.string().optional(),
});

// ----------------- Auth -----------------
export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return first error for simplicity, you can return all if you want
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};
