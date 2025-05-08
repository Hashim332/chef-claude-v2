import { useRecipeContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { useState } from "react";

export default function SaveRecipeButton() {
  const [buttonOff, setButtonOff] = useState(false);
  const { recipe, setSavedRecipes } = useRecipeContext();

  function SaveRecipe() {
    recipe &&
      setSavedRecipes((prevSavedRecipes) => [...prevSavedRecipes, recipe]);
    setButtonOff(true);
  }

  return (
    <Button
      onClick={SaveRecipe}
      className="text-xl hover:cursor-pointer"
      disabled={buttonOff}
    >
      Save Recipe
    </Button>
  );
}
