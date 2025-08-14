import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/authRoutes";
import boardsRoutes from "./routes/boardsRoutes";
import tasksRoutes from "./routes/tasksRoutes";
import { authenticate } from "./middleware/authMiddleware";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

// Socket.io setup
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardsRoutes); // <- fix prefix for Jest tests
app.use("/api/tasks", tasksRoutes); // <- register tasks routes

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Project Management API Running");
});

export { app, server, io, prisma };
