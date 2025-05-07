import { createContext, useContext, useState } from "react";
import { RecipeObject } from "@/utils/utils";

type RecipeGeneratorContext = {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  recipe: RecipeObject | null;
  setRecipe: React.Dispatch<React.SetStateAction<RecipeObject | null>>;
  savedRecipes: RecipeObject[];
  setSavedRecipes: React.Dispatch<React.SetStateAction<RecipeObject[]>>;
};

const recipeGenerator = createContext<RecipeGeneratorContext | null>(null);

// prettier-ignore
export function RecipeGeneratorProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<RecipeObject | null>(null)
  const [savedRecipes, setSavedRecipes] = useState<RecipeObject[]>([])

  return (
    <recipeGenerator.Provider value={{ ingredients, setIngredients, recipe, setRecipe, savedRecipes, setSavedRecipes }}>
      {children}
    </recipeGenerator.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(recipeGenerator);
  if (!context) {
    throw new Error(
      "useRecipeContext must be used within an RecipeGenerator Provider"
    );
  }
  return context;
}
