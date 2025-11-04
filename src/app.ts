import express from "express";
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

dotenv.config();

const allowedOrigins = [
  "http://localhost:3000",
  "https://project-management-app-roan.vercel.app",
];

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // if you use cookies or auth headers
  })
);
app.use(express.json());

const prisma = new PrismaClient();
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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (req, res) => res.send("Project Management API Running"));

// Error handler
app.use(errorHandler);

export { app, server, io, prisma };
