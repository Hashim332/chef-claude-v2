import { useRecipeContext } from "@/context/AppContext";
import SavedRecipeCard from "./SavedRecipeCard";
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function YourRecipes() {
  const { getToken } = useAuth();

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
        console.log(data);
      } catch (err) {
        console.error("Error with fetching recipes from backend: ", err);
      }
    }
    getUserRecipes();
  }, []);

  const { savedRecipes } = useRecipeContext(); //TODO: change this into state that gets recipes from db
  const recipeCards = savedRecipes.map((recipeObj) => {
    return <SavedRecipeCard recipe={recipeObj} />;
  });

  console.log("saved recipe array should be visible HERE ---->", savedRecipes);

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
