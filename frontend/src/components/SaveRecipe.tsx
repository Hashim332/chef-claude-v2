import { useRecipeContext } from "@/context/AppContext";
import { Button } from "./ui/button";

export default function SaveRecipeButton() {
  const { recipe, setSavedRecipes, savedRecipes } = useRecipeContext();

  function SaveRecipe() {
    recipe &&
      setSavedRecipes((prevSavedRecipes) => [...prevSavedRecipes, recipe]);
    console.log(savedRecipes);
  }
  return (
    <Button onClick={SaveRecipe} className="text-xl hover:cursor-pointer">
      Save Recipe
    </Button>
  );
}
