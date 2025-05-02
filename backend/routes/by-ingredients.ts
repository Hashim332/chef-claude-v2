import express from "express";
import { getRecipeFromChefClaude } from "../src/claudePrompt";

const router = express.Router();

router.use(express.json());

router.post("/recipes/by-ingredients", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    res.status(400).json({
      error:
        "Invalid request: 'ingredients' is required and must be an array of strings.",
    });
    return;
  }

  try {
    const recipe = await getRecipeFromChefClaude(ingredients);
    console.log(recipe);
    res.status(200).json(recipe);
  } catch (err) {
    console.error("Server error:", err);
    res
      .status(500)
      .json({ error: "An unexpected error occurred on the server." });
    return;
  }
});

export default router;
