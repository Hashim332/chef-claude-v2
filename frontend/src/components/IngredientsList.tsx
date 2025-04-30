import { useIngredients } from "@/context/HomeContext";

export default function IngredientsList() {
  const { ingredients } = useIngredients();

  const ingredientsExists = ingredients.length !== 0;

  return (
    <div className="m-2 md:m-12">
      {ingredientsExists && (
        <div>
          <div className="flex flex-row items-center mt-8 justify-between">
            <h1 className="text-3xl font-semibold">Your ingredients:</h1>
            {ingredients.length > 0 && (
              <h2
                className={`text-sm px-3 py-1 rounded-full font-medium ${
                  ingredients.length >= 4
                    ? "bg-green-100 text-green-700"
                    : "bg-primary/10 text-primary"
                }`}
              >
                {ingredients.length >= 4
                  ? "Ready to cook!"
                  : `${ingredients.length}/4 ingredients selected`}
              </h2>
            )}
          </div>
          <ul className="text-xl list-disc pl-6">
            {ingredients.map((ingredient) => (
              <li key={ingredient} className="mt-2">
                {ingredient}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
