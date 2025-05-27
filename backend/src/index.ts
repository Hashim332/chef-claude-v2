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

// Import and validate routes one by one
const routes = [
  { name: "byIngredients", path: "../routes/by-ingredients" },
  { name: "byImage", path: "../routes/by-image" },
  { name: "preview", path: "../routes/preview" },
  { name: "saveRecipe", path: "../routes/save-recipe" },
  { name: "userRecipes", path: "../routes/user-recipes" },
];

const loadedRoutes: any = {};

routes.forEach(({ name, path }) => {
  try {
    const route = require(path);
    if (
      typeof route === "function" ||
      (route && typeof route.default === "function")
    ) {
      loadedRoutes[name] = route.default || route;
      console.log(`✓ Loaded route: ${name}`);
    } else {
      console.error(`✗ Route ${name} is not a function:`, typeof route);
    }
  } catch (error: any) {
    console.error(`✗ Failed to load route ${name}:`, error.message);
  }
});

// Apply routes safely
if (loadedRoutes.byIngredients) app.use("/api", loadedRoutes.byIngredients);
if (loadedRoutes.byImage) app.use("/api", loadedRoutes.byImage);
if (loadedRoutes.preview) app.use("/api", loadedRoutes.preview);

// Protected routes
if (loadedRoutes.saveRecipe)
  app.use("/api", clerkMiddleware(), loadedRoutes.saveRecipe);
if (loadedRoutes.userRecipes)
  app.use("/api", clerkMiddleware(), loadedRoutes.userRecipes);

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
