import { createContext, useContext, useState, ReactNode } from "react";
import { RecipeObject } from "@/utils/utils";

// changed these from React.Dispatch<React.SetStateAction<...>> to (...: ...) => void to fix type errors
// even though React.Dispatch and .SetStateAction are more robust, the current implementation
// is more concise and easier to understand
type RecipeGeneratorContext = {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
  recipe: RecipeObject | null;
  setRecipe: React.Dispatch<React.SetStateAction<RecipeObject | null>>;
  savedRecipes: RecipeObject[];
  setSavedRecipes: React.Dispatch<React.SetStateAction<RecipeObject[]>>;
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  preview: string | null;
  setPreview: React.Dispatch<React.SetStateAction<string | null>>;
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
