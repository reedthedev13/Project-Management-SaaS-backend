import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import boardsRouter from "./routes/boardsRoutes";
import authRouter from "./routes/auth";

// 1️⃣ Load the correct .env file based on NODE_ENV
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: envFile });

console.log("Running server with DB:", process.env.DATABASE_URL);

// 2️⃣ Setup Express
const app = express();

app.use(cors());
app.use(express.json());

// 3️⃣ Routes
app.use("/api/boards", boardsRouter);
app.use("/api/auth", authRouter);

// 4️⃣ Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
