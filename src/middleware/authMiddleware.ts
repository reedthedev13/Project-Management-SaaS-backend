import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("❌ Missing JWT_SECRET environment variable");
}

// Extend Request safely
export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
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
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload & {
      userId?: number;
      email?: string;
      name?: string;
    };

    if (!payload || !payload.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.userId = payload.userId;
    req.userEmail = payload.email;
    req.userName = payload.name;

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
