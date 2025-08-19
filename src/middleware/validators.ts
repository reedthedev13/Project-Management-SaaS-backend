import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { z } from "zod";

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
