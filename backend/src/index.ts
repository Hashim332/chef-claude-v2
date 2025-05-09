import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware, getAuth } from "@clerk/express";
import byIngredients from "../routes/by-ingredients";
import saveRecipe from "../routes/save-recipe";

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get("/api", (req, res) => {
  res.send("Hello from Express + TypeScript!");
  const { userId } = getAuth(req);
  console.log(userId);
});

app.use("/api/", byIngredients);
app.use("/api/", saveRecipe);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
