import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import byIngredients from "../routes/by-ingredients";
import saveRecipe from "../routes/save-recipe";
import userRecipes from "../routes/user-recipes";
import byImage from "../routes/by-image";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/api", (req, res) => {
  res.send("Hello from Express + TypeScript!");

  res.status(200).json({ message: "You hit the root!" });
});

app.use("/api/", byIngredients);
app.use("/api/", byImage);
app.use("/api/", saveRecipe);
app.use("/api/", userRecipes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
