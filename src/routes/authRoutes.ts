import express from "express";
import { body } from "express-validator";
import { register, login, me } from "../controllers/authController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  register
);

router.post("/login", login);

router.get("/me", authenticate, me);  

export default router;
