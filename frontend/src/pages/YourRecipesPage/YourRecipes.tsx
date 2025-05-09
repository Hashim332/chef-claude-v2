import { useRecipeContext } from "@/context/AppContext";
import SavedRecipeCard from "./SavedRecipeCard";

export default function YourRecipes() {
  const { savedRecipes } = useRecipeContext();
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
