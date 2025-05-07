import { useState } from "react";
import { ChefHat, ArrowRight } from "lucide-react";
import { useRecipeContext } from "@/context/AppContext";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/clerk-react";

export default function SendPrompt({}) {
  const [isLoading, setIsLoading] = useState(false);
  const { ingredients, setRecipe, recipe } = useRecipeContext();
  const { getToken } = useAuth();

  async function submitIngredients() {
    setRecipe("");
    setIsLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/recipes/by-ingredients`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ingredients,
          }),
        }
      );
      const data = await res.json();
      setRecipe(data.text);
      console.log("your recipe should be here: ", data);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="mt-8 mx-auto bg-amber-50 border border-primary rounded-lg p-4 shadow-sm w-auto max-w-xl ">
      <div className="flex items-center gap-2 mb-3">
        <ChefHat className="text-primary" size={24} />
        <h3 className="text-lg font-semibold text-gray-800">Ready to cook!</h3>
      </div>

      <p className="text-gray-700 mb-4">
        You've selected {ingredients.length} ingredients. Let's create a recipe
        with what you have on hand!
      </p>

      <div className="flex justify-end">
        <Button
          onClick={submitIngredients}
          disabled={isLoading}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md font-medium transition-colors hover:cursor-pointer"
        >
          {isLoading ? (
            <>
              <span className="animate-pulse">Creating recipe</span>
              <span className="animate-bounce">...</span>
            </>
          ) : (
            <>
              Get Recipe
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
