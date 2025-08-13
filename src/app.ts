import express, { Request, Response } from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/authRoutes";
import { authenticate, AuthRequest } from "./middleware/authMiddleware";

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

  socket.on("taskCreated", (task) => {
    socket.broadcast.emit("taskCreated", task);
  });

  socket.on("taskUpdated", (task) => {
    socket.broadcast.emit("taskUpdated", task);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Project Management API Running");
});

// Boards API
app.get("/boards", async (req: Request, res: Response) => {
  try {
    const boards = await prisma.board.findMany({
      include: {
        tasks: true,
        members: true,
      },
    });
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
});

app.post("/boards", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.userId;
    if (!ownerId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { title } = req.body;

    const newBoard = await prisma.board.create({
      data: { title, ownerId },
    });

    res.status(201).json(newBoard);
    io.emit("boardCreated", newBoard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create board" });
  }
});

export { app, server, io };
