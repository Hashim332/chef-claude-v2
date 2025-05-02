import { createContext, useContext, useState } from "react";

type Recipe = {
  type: string;
  text: string;
};

type RecipeGenetaratorContextType = {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  recipe: Recipe;
  setRecipe: React.Dispatch<React.SetStateAction<Recipe>>;
};

const recipeGenerator = createContext<RecipeGenetaratorContextType | null>(
  null
);

// prettier-ignore
export function RecipeGeneratorProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe>({type:"", text:""})

  return (
    <recipeGenerator.Provider value={{ ingredients, setIngredients,recipe, setRecipe }}>
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
