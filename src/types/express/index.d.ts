import express from "express";
import { Request } from "express";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
    }
    interface Request {
      user?: User;
    }
  }
}
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email?: string;
  };
}
