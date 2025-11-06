import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";

import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/authRoutes";
import boardsRoutes from "./routes/boardsRoutes";
import tasksRoutes from "./routes/tasksRoutes";
import userRoutes from "./routes/userRoutes";

import { errorHandler } from "./middleware/errorHandler";

// Load env
dotenv.config({
  path:
    process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

const app = express();

// ----------------------
// Middleware
// ----------------------
// src/app.ts

const allowedOrigins = [
  "http://localhost:3000", // local dev
  process.env.FRONTEND_URL || "", // production frontend
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Requests from Postman, curl, or server-to-server may have no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      console.warn("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// ----------------------
// Prisma client
// ----------------------
const prisma = new PrismaClient();

// ----------------------
// Socket.IO setup
// ----------------------
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("taskCreated", (task) =>
    socket.broadcast.emit("taskCreated", task)
  );
  socket.on("taskUpdated", (task) =>
    socket.broadcast.emit("taskUpdated", task)
  );

  socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});

// ----------------------
// Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (_req: Request, res: Response) =>
  res.send("Project Management API Running")
);

// Error handling
app.use(errorHandler);

// ----------------------
// Export
// ----------------------
export { app, server, io, prisma };
