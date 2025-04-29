import { useIngredients } from "@/context/HomeContext";

export default function IngredientsList() {
  const { ingredients } = useIngredients();

  return (
    <div className="mt-12">
      <h1 className="text-3xl font-semibold">Your ingredients:</h1>
      <div>
        {ingredients.map((ingredient) => (
          <div key={ingredient}>{ingredient}</div>
        ))}
      </div>
    </div>
  );
}
