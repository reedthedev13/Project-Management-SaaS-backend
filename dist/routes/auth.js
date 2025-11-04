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
        const { name, email, password } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ error: "Email already registered" });
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
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
});
// --- Login Route ---
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Login payload:", req.body); // log what frontend sends
    if (!email || !password)
        return res.status(400).json({ error: "Missing fields" });
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        console.log("Found user:", user); // log what we find in DB
        if (!user)
            return res.status(401).json({ error: "Invalid credentials" });
        const validPassword = await bcryptjs_1.default.compare(password, user.passwordHash);
        console.log("Password valid?", validPassword);
        if (!validPassword)
            return res.status(401).json({ error: "Invalid credentials" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1d",
        });
        return res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
