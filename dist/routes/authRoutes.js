"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
// --- Register Route ---
router.post("/register", async (req, res) => {
    try {
        console.log("Register payload received:", req.body);
        const { name, email, password } = req.body;
        if (!email || !password || !name) {
            return res
                .status(400)
                .json({ error: "Missing name, email, or password" });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, passwordHash: hashedPassword },
            select: { id: true, name: true, email: true, createdAt: true },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.status(201).json({ user: newUser, token });
    }
    catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});
// --- Login Route ---
router.post("/login", async (req, res) => {
    try {
        console.log("Login payload received:", req.body);
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: "Missing email or password" });
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const validPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!validPassword)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "7d",
        });
        return res.json({
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    }
    catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});
// --- Me route ---
router.get("/me", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ error: "Missing token" });
    const token = authHeader.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        return res.json({ id: user.id, name: user.name, email: user.email });
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid token" });
    }
});
exports.default = router;
