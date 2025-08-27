import express from "express";
import { getRecipeFromIngredients } from "../src/claudePrompt";

const router = express.Router();

router.use(express.json());

router.post("/generate/by-ingredients", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients || !Array.isArray(ingredients)) {
    res.status(400).json({
      error:
        "Invalid request: 'ingredients' is required and must be an array of strings.",
    });
    return;
  }

  try {
    // if recipe doesnt exist or recipt isnt text
    const recipe = await getRecipeFromIngredients(ingredients);

    if (!recipe || recipe.type !== "text") {
      return res.status(400).json({
        error: "Invalid response from Claude",
      });
    }

    console.log(recipe);
    // text is a part of the content block recieved from claude which is being parsed to form an valid JS object
    if (recipe.type === "text") {
      const recipeObject = JSON.parse(recipe.text);
      res.status(200).json(recipeObject);
    }
    return;
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({
      error:
        "An unexpected error occurred on the server on the by-ingredients route",
    });
    return;
  }
});

export default router;
