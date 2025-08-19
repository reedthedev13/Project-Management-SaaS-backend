import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validators"; // centralized validation handler

const router = express.Router();

// ---------------- Register ----------------
router.post(
  "/register",
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  validateRequest,
  register
);

// ---------------- Login ----------------
router.post(
  "/login",
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
  validateRequest,
  login
);

// ---------------- Me ----------------
router.get("/me", authenticate, me);

export default router;
