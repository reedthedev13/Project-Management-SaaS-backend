"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("../controllers/usersController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// ----------------------
// Profile Endpoints
// ----------------------
// GET /api/users/me - fetch current user profile
router.get("/me", authMiddleware_1.authenticate, usersController_1.getProfile);
// PUT /api/users/me - update current user profile
router.put("/me", authMiddleware_1.authenticate, usersController_1.updateProfile);
// DELETE /api/users/me - delete current user account
router.delete("/me", authMiddleware_1.authenticate, usersController_1.deleteAccount);
// ----------------------
// Preferences Endpoints
// ----------------------
// GET /api/users/preferences - fetch user preferences
router.get("/preferences", authMiddleware_1.authenticate, usersController_1.getPreferences);
// PUT /api/users/preferences - update user preferences
router.put("/preferences", authMiddleware_1.authenticate, usersController_1.updatePreferences);
exports.default = router;
