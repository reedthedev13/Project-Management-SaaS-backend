"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferences = exports.getPreferences = exports.deleteAccount = exports.updateProfile = exports.getProfile = void 0;
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
// ----------------------
// GET User Profile
// ----------------------
const getProfile = async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: req.userId },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Get profile error:", error);
        return res.status(500).json({ error: "Failed to fetch profile" });
    }
};
exports.getProfile = getProfile;
// ----------------------
// UPDATE User Profile
// ----------------------
const updateProfile = async (req, res) => {
    const { name, email } = req.body;
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const updatedUser = await prismaClient_1.default.user.update({
            where: { id: req.userId },
            data: {
                ...(name && { name }),
                ...(email && { email }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ error: "Failed to update profile" });
    }
};
exports.updateProfile = updateProfile;
// ----------------------
// DELETE User Account
// ----------------------
const deleteAccount = async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        await prismaClient_1.default.user.delete({
            where: { id: req.userId },
        });
        return res.status(204).send();
    }
    catch (error) {
        console.error("Delete account error:", error);
        return res.status(500).json({ error: "Failed to delete account" });
    }
};
exports.deleteAccount = deleteAccount;
// ----------------------
// GET User Preferences
// ----------------------
const getPreferences = async (req, res) => {
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const user = await prismaClient_1.default.user.findUnique({
            where: { id: req.userId },
            select: {
                theme: true,
                notifications: true,
            },
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Get preferences error:", error);
        return res.status(500).json({ error: "Failed to fetch preferences" });
    }
};
exports.getPreferences = getPreferences;
// ----------------------
// UPDATE User Preferences
// ----------------------
const updatePreferences = async (req, res) => {
    const { theme, notifications } = req.body;
    if (!req.userId)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const updatedUser = await prismaClient_1.default.user.update({
            where: { id: req.userId },
            data: {
                ...(theme && { theme }),
                ...(typeof notifications === "boolean" && { notifications }),
            },
            select: {
                theme: true,
                notifications: true,
            },
        });
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        console.error("Update preferences error:", error);
        return res.status(500).json({ error: "Failed to update preferences" });
    }
};
exports.updatePreferences = updatePreferences;
