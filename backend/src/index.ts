import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import byIngredients from "../routes/by-ingredients";
import saveRecipe from "../routes/save-recipe";
import userRecipes from "../routes/user-recipes";
import byImage from "../routes/by-image";
import preview from "../routes/preview";

const app = express();
const port = Number(process.env.PORT) || 8000;
const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://frontend-production-0a74.up.railway.app", // prod
];

// CORS: allow your frontend domain
app.use(
  cors({
    origin: (origin, callback) => {
      // For preflight requests or requests from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"], // Add OPTIONS for preflight
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  })
);

// Body parsers
app.use(express.json());

// Root route - Fixed to avoid double response
app.get("/api", (req, res) => {
  res.status(200).json({ message: "API is running!" });
});

// Regular API routes
app.use("/api", byIngredients);
app.use("/api", byImage);
app.use("/api", preview); // Make sure this route has proper file upload handling

// Protected routes
app.use("/api", clerkMiddleware(), saveRecipe);
app.use("/api", clerkMiddleware(), userRecipes);

// Uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION:", error);
  // Don't exit process in production, but do log the error
});

// Start server
app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
