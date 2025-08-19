import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Global error caught:", err);

  if (err instanceof ZodError) {
    // Use .issues instead of .errors
    return res.status(400).json({
      message: "Validation error",
      details: err.issues, // <-- corrected
    });
  }

  // Handle custom AppError (if you use one)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message,
      details: err.errors || null,
    });
  }

  // Fallback for unexpected errors
  res.status(500).json({
    message: "Internal Server Error",
  });
};
