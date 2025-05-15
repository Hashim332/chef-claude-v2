import { useState } from "react";
import RecipeModal from "./RecipeModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import { RecipeObject } from "@/utils/utils";
// import { useRecipeContext } from "@/context/AppContext";

type RecipeCardProps = {
  recipe: RecipeObject;
  savedRecipes: RecipeObject[];
  setSavedRecipes: React.Dispatch<React.SetStateAction<RecipeObject[]>>;
};

export default function SavedRecipeCard({
  recipe,
  savedRecipes,
  setSavedRecipes,
}: RecipeCardProps) {
  const [showRecipe, setShowRecipe] = useState(false);
  const { getToken } = useAuth();

  async function deleteRecipe(recipeId: string | undefined) {
    if (recipeId === undefined) {
      return;
    }
    try {
      const token = await getToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/user-recipes/${recipeId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // waiting for validated delete and deleteing on client
      if (res.status === 200) {
        const updatedRecipes = savedRecipes.filter(
          (recipe) => recipe.recipeId !== recipeId
        );

        setSavedRecipes(updatedRecipes);
      }
    } catch (err) {
      console.error("Error deleting recipe: ", err);
    }
  }

  return (
    <section>
      <div className="my-4 w-full rounded-md sm:p-4 flex justify-between items-center">
        <div
          key={recipe.recipeId}
          onClick={() => setShowRecipe(true)}
          className="flex flex-col border hover:bg-secondary/10 rounded-md p-2 w-full cursor-pointer transition-colors"
        >
          <h1 className="text-xl font-bold">{recipe.recipeName}</h1>
          <p>{recipe.quickSummary}</p>
        </div>

        <Button
          className="ml-4 bg-tertiary text-secondary border hover:bg-red-500 hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            deleteRecipe(recipe.recipeId);
          }}
        >
          <Trash2 />
        </Button>
      </div>

      {showRecipe && (
        <RecipeModal
          key={recipe.recipeId}
          closeModal={() => setShowRecipe(false)}
          recipe={recipe}
          deleteRecipe={deleteRecipe}
        />
      )}
    </section>
  );
}
