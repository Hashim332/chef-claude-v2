import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import byIngredients from "../routes/by-ingredients";
import saveRecipe from "../routes/save-recipe";
import userRecipes from "../routes/user-recipes";
import byImage from "../routes/by-image";
import preview from "../routes/preview";

const app = express();
const port = process.env.PORT || 8000;
const allowedOrigins = [
  "http://localhost:5173", // dev
  "https://frontend-production-0a74.up.railway.app", // prod
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you're using cookies/auth
  })
);
app.use(express.json());

app.get("/api", (req, res) => {
  res.send("Hello from Express + TypeScript!");

  res.status(200).json({ message: "You hit the root!" });
});

app.use("/api", byIngredients);
app.use("/api", byImage);
app.use("/api", preview);

// now protect everything under /api/protected...
app.use("/api", clerkMiddleware(), saveRecipe);
app.use("/api", clerkMiddleware(), userRecipes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
