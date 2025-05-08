import { useState } from "react";
import RecipeModal from "./RecipeModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { RecipeObject } from "@/utils/utils";
import { useRecipeContext } from "@/context/AppContext";

type RecipeCardProps = {
  recipe: RecipeObject;
};

export default function SavedRecipeCard({ recipe }: RecipeCardProps) {
  const { savedRecipes, setSavedRecipes } = useRecipeContext();
  const [showRecipe, setShowRecipe] = useState(false);

  function deleteRecipe(recipeName: string) {
    if (savedRecipes !== undefined) {
      const newSavedRecipes = savedRecipes.filter(
        (savedRecipe: RecipeObject) => {
          savedRecipe.recipeName !== recipeName;
        }
      );
      setSavedRecipes(newSavedRecipes);
    }
  }

  return (
    <section>
      <div className="my-4 w-full rounded-md p-4 flex justify-between items-center">
        <div
          onClick={() => setShowRecipe(true)}
          className="flex flex-col border hover:bg-secondary/10 rounded-md p-2 w-full cursor-pointer transition-colors"
        >
          <h1 className="text-xl font-bold">{recipe.recipeName}</h1>
          <p>{recipe.quickSummary}</p>
        </div>

        <Button
          className="ml-4 bg-tertiary text-secondary border hover:bg-red-500 hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // still good practice
            deleteRecipe(recipe.recipeName);
          }}
        >
          <Trash2 />
        </Button>
      </div>

      {showRecipe && (
        <RecipeModal
          key={recipe.recipeName}
          closeModal={() => setShowRecipe(false)}
          recipeName={recipe.recipeName}
          fullRecipe={recipe.fullRecipe}
          deleteRecipe={deleteRecipe}
        />
      )}
    </section>
  );
}
