import { Router } from "express";
import { register, login, me } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route
router.get("/me", authenticate, me);

export default router;
