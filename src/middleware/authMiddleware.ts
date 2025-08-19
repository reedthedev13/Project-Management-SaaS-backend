import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

// Extend Request safely
export interface AuthRequest extends Request {
  userId?: number; // safe, no conflicts
  userEmail?: string; // optional extra info if needed
  userName?: string;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      email?: string;
      name?: string;
    };

    req.userId = payload.userId;
    req.userEmail = payload.email;
    req.userName = payload.name;

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
