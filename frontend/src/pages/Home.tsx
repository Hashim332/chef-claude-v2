import IngredientForm from "@/components/IngredientForm";
import IngredientsList from "@/components/IngredientsList";
import Recipe from "@/components/Recipe";
import SaveRecipeButton from "@/components/SaveRecipe";
import SendPrompt from "@/components/SendPrompt";
import { useRecipeContext } from "@/context/HomeContext";
import { smoothScrollTo } from "@/utils/utils";
import { useEffect, useRef } from "react";

export default function Home() {
  const { ingredients, recipe } = useRecipeContext();
  const enoughIngredients = ingredients.length >= 4;
  const recipeSection = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (recipeSection.current && recipe?.text) {
      const top =
        recipeSection.current.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(top, 1000); // Scroll to the recipe over 1 second
    }
  }, [recipe?.text]);

  return (
    <div>
      <IngredientForm />
      <IngredientsList />
      {enoughIngredients && <SendPrompt />}
      {recipe.text && (
        <div ref={recipeSection}>
          <Recipe />
        </div>
      )}
      {recipe.text && <SaveRecipeButton />}
    </div>
  );
}
