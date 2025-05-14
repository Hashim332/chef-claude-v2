import express from "express";
import { getRecipeFromChefClaude } from "../src/claudePrompt";

const router = express.Router();

router.use(express.json());

router.post("/generate/by-image", async (req, res) => {
  const something = 1;
  const image = req.body;
  console.log(image);
});

export default router;
