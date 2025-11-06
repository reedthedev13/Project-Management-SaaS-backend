import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../prisma/prismaClient";

// ----------------------
// GET User Profile
// ----------------------
export const getProfile = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ----------------------
// UPDATE User Profile
// ----------------------
export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
  const { name, email } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { ...(name && { name }), ...(email && { email }) },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};

// ----------------------
// DELETE User Account
// ----------------------
export const deleteAccount = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await prisma.user.delete({ where: { id: req.userId } });
    return res.status(204).send();
  } catch (err) {
    console.error("Delete account error:", err);
    return res.status(500).json({ error: "Failed to delete account" });
  }
};

// ----------------------
// GET User Preferences
// ----------------------
export const getPreferences = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { theme: true, notifications: true },
    });

    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    console.error("Get preferences error:", err);
    return res.status(500).json({ error: "Failed to fetch preferences" });
  }
};

// ----------------------
// UPDATE User Preferences
// ----------------------
export const updatePreferences = async (req: AuthRequest, res: Response) => {
  if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
  const { theme, notifications } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(theme && { theme }),
        ...(typeof notifications === "boolean" && { notifications }),
      },
      select: { theme: true, notifications: true },
    });

    return res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Update preferences error:", err);
    return res.status(500).json({ error: "Failed to update preferences" });
  }
};
