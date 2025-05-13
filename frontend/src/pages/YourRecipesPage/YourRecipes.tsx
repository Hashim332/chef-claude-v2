import SavedRecipeCard from "./SavedRecipeCard";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { RecipeObject } from "@/utils/utils";

export default function YourRecipes() {
  const { getToken } = useAuth();
  const [savedRecipes, setSavedRecipes] = useState<RecipeObject[]>([]);

  useEffect(() => {
    async function getUserRecipes() {
      try {
        const token = await getToken();
        if (!token) {
          throw new Error("Authentication token is missing");
        }

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/user-recipes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setSavedRecipes(data.allSavedRecipes);
      } catch (err) {
        console.error("Error with fetching recipes from backend: ", err);
      }
    }
    getUserRecipes();
  }, []);

  const recipeCards = savedRecipes.map((recipeObj) => {
    return (
      <SavedRecipeCard
        savedRecipes={savedRecipes}
        setSavedRecipes={setSavedRecipes}
        recipe={recipeObj}
      />
    );
  });

  // console.log("saved recipe array should be visible HERE ---->", savedRecipes); //FIXME:

  return (
    <div>
      <h1 className="text-3xl">Your Recipes</h1>
      {recipeCards.length === 0 && (
        <p className="text-lg my-4">You have no saved recipes.</p>
      )}
      {recipeCards}
    </div>
  );
}
