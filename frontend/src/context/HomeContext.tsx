import { createContext, useContext, useState } from "react";

type IngredientContextType = {
  ingredients: string[];
  setIngredients: React.Dispatch<React.SetStateAction<string[]>>;
};

const IngredientContext = createContext<IngredientContextType | null>(null);
// prettier-ignore
export function IngredientProvider({ children }: { children: React.ReactNode }) {
  const [ingredients, setIngredients] = useState<string[]>([]);

  return (
    <IngredientContext.Provider value={{ ingredients, setIngredients }}>
      {children}
    </IngredientContext.Provider>
  );
}

export function useIngredients() {
  const context = useContext(IngredientContext);
  if (!context) {
    throw new Error("useIngredients must be used within an IngredientProvider");
  }
  return context;
}
