import { createContext, useContext, useState, ReactNode } from "react";
import { RecipeObject } from "@/utils/utils";

// changed these from React.Dispatch<React.SetStateAction<...>> to (...: ...) => void to fix type errors
// even though React.Dispatch and .SetStateAction are more robust, the current implementation
// is more concise and easier to understand
type RecipeGeneratorContext = {
  ingredients: string[];
  setIngredients: (ingredients: string[]) => void;
  recipe: RecipeObject | null;
  setRecipe: (recipe: RecipeObject | null) => void;
  savedRecipes: RecipeObject[];
  setSavedRecipes: (savedRecipes: RecipeObject[]) => void;
  file: File | null;
  setFile: (file: File) => void;
  preview: string | null;
  setPreview: (preview: string) => void;
  resetAll: () => void;
};

const recipeGenerator = createContext<RecipeGeneratorContext | null>(null);

export function RecipeGeneratorProvider({ children }: { children: ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<RecipeObject | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<RecipeObject[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const resetAll = () => {
    setIngredients([]);
    setRecipe(null);
    setFile(null);
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev); // Clean up blob URL
      return null;
    });
  };

  return (
    <recipeGenerator.Provider
      value={{
        ingredients,
        setIngredients,
        recipe,
        setRecipe,
        savedRecipes,
        setSavedRecipes,
        file,
        setFile,
        preview,
        setPreview,
        resetAll,
      }}
    >
      {children}
    </recipeGenerator.Provider>
  );
}

export function useRecipeContext() {
  const context = useContext(recipeGenerator);
  if (!context) {
    throw new Error(
      "useRecipeContext must be used within a RecipeGeneratorProvider"
    );
  }
  return context;
}
