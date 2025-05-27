import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();
// Convert port to number for express.listen()
const port = parseInt(process.env.PORT || "8000", 10);

const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-production-0a74.up.railway.app",
];

// CORS
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
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

// Import routes with error handling
try {
  const byIngredients = require("../routes/by-ingredients");
  const byImage = require("../routes/by-image");
  const preview = require("../routes/preview");
  const saveRecipe = require("../routes/save-recipe");
  const userRecipes = require("../routes/user-recipes");

  // Public routes
  app.use("/api", byIngredients);
  app.use("/api", byImage);
  app.use("/api", preview);

  // Protected routes
  app.use("/api", clerkMiddleware(), saveRecipe);
  app.use("/api", clerkMiddleware(), userRecipes);

  console.log("All routes loaded successfully");
} catch (error) {
  console.error("Route loading error:", error);
  // Continue running with basic functionality
}

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
