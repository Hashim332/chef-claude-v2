import { useState } from "react";
import RecipeModal from "./RecipeModal";

export default function SavedRecipeCard() {
  const [showRecipe, setShowRecipe] = useState(false);

  return (
    <section>
      <div
        onClick={() => setShowRecipe(true)}
        className="border-1 my-4 hover:bg-secondary/10 max-w-md"
      >
        <h1 className="text-xl font-bold">Recipe name</h1>
        <p>Recipe description</p>
      </div>
      {showRecipe && <RecipeModal closeModal={() => setShowRecipe(false)} />}
    </section>
  );
}
