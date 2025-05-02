import { useRecipeContext } from "@/context/HomeContext";
import { X } from "lucide-react";

export default function IngredientsList() {
  const { ingredients, setIngredients } = useRecipeContext();
  const ingredientsExists = ingredients.length !== 0;

  function removeIngredient(ingredient: string) {
    const newIngredients = ingredients.filter(
      (toRemove) => ingredient !== toRemove
    );
    setIngredients(newIngredients);
  }
  return (
    <div className="m-2 md:m-1">
      {ingredientsExists && (
        <div className="md:mt-12 max-w-xl mx-auto">
          <div className="flex flex-col md:flex-row items-center mt-4 justify-between">
            <h1 className="text-3xl font-semibold mb-2">Your ingredients:</h1>
            {ingredients.length > 0 && (
              <div
                className={`text-sm px-2 rounded-full font-medium ${
                  ingredients.length >= 4
                    ? "bg-green-100 text-green-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {ingredients.length >= 4
                  ? "Ready to cook!"
                  : `${ingredients.length}/4 ingredients selected`}
              </div>
            )}
          </div>
          <div className="mt-4 mx-4">
            <div className="flex flex-col md:flex-row md:flex-wrap md:gap-3">
              {ingredients.map((ingredient) => (
                <div
                  key={ingredient}
                  className="mt-2 md:mt-0 md:flex-grow-0 md:w-auto flex items-center justify-between px-4 py-2 bg-white rounded-md"
                >
                  <p className="font-serif mr-3">{ingredient}</p>
                  <button
                    className="p-2 rounded-full hover:bg-secondary/10 hover:text-[#b34c4c] transition-colors focus:outline-none hover:cursor-pointer"
                    onClick={() => removeIngredient(ingredient)}
                    aria-label={`Remove ${ingredient}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
