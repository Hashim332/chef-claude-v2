import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import byIngredientsRoute from "../routes/by-ingredients";
import byImageRoute from "../routes/by-image";
import saveRecipeRoute from "../routes/save-recipe";
import userRecipesRoute from "../routes/user-recipes";

const app = express();
// Convert port to number for express.listen()
const port = parseInt(process.env.PORT || "8000", 10);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://frontend-production-0a74.up.railway.app",
];

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body parsers
app.use(express.json());

// Test route first - ensure basic functionality
app.get("/api", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

// Apply routes
app.use("/api", byIngredientsRoute);
app.use("/api", byImageRoute);

// Protected routes
app.use("/api", clerkMiddleware(), saveRecipeRoute);
app.use("/api", clerkMiddleware(), userRecipesRoute);

// Error handlers
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error.message);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});

// Start server
app
  .listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
  })
  .on("error", (err) => {
    console.error("Server startup error:", err);
  });
