"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.io = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const boardsRoutes_1 = __importDefault(require("./routes/boardsRoutes"));
const tasksRoutes_1 = __importDefault(require("./routes/tasksRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes")); // ✅ add this
const errorHandler_1 = require("./middleware/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
exports.io = io;
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("taskCreated", (task) => socket.broadcast.emit("taskCreated", task));
    socket.on("taskUpdated", (task) => socket.broadcast.emit("taskUpdated", task));
    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
});
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/boards", boardsRoutes_1.default);
app.use("/api/tasks", tasksRoutes_1.default);
app.use("/api/users", userRoutes_1.default); // ✅ mount users here
// Health check
app.get("/", (req, res) => res.send("Project Management API Running"));
// Error handler
app.use(errorHandler_1.errorHandler);
