import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import boardsRoutes from "./routes/boardsRoutes";
import tasksRoutes from "./routes/tasksRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config({
  path:
    process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

export interface AuthRequest extends Request {
  userId?: number;
  userEmail?: string;
  userName?: string;
}

const app = express();

const FRONTEND_URL =
  process.env.FRONTEND_URL_PROD ||
  process.env.FRONTEND_URL_LOCAL ||
  "http://localhost:3000";

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === FRONTEND_URL) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/", (_req: Request, res: Response) =>
  res.send("Project Management API Running")
);

// Error handler
app.use(errorHandler);

const server = http.createServer(app);

// Socket.IO setup
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

export { app, server, io };
