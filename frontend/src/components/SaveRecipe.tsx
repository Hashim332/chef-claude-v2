import { useRecipeContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function SaveRecipeButton() {
  const [buttonOff, setButtonOff] = useState(false);
  const { recipe, setSavedRecipes } = useRecipeContext();
  const { getToken } = useAuth();

  async function SaveRecipe() {
    recipe &&
      setSavedRecipes((prevSavedRecipes) => [...prevSavedRecipes, recipe]);
    setButtonOff(true);

    const token = await getToken();
    console.log("Attempting to fetch from:", import.meta.env.VITE_API_URL);

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/save-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recipe: recipe }),
      });
    } catch (err) {
      console.error("There was an issue with the backend request --->", err);
    }
  }

  return (
    <Button
      onClick={SaveRecipe}
      className="text-xl hover:cursor-pointer w-[40%] sm:w-[50%]"
      disabled={buttonOff}
    >
      Save Recipe
    </Button>
  );
}
