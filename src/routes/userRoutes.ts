import express from "express";
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getPreferences,
  updatePreferences,
} from "../controllers/usersController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

// ----------------------
// Profile Endpoints
// ----------------------

// GET /api/users/me - fetch current user profile
router.get("/me", authenticate, getProfile);

// PUT /api/users/me - update current user profile
router.put("/me", authenticate, updateProfile);

// DELETE /api/users/me - delete current user account
router.delete("/me", authenticate, deleteAccount);

// ----------------------
// Preferences Endpoints
// ----------------------

// GET /api/users/preferences - fetch user preferences
router.get("/preferences", authenticate, getPreferences);

// PUT /api/users/preferences - update user preferences
router.put("/preferences", authenticate, updatePreferences);

export default router;
