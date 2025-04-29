import { useIngredients } from "@/context/HomeContext";

export default function IngredientsList() {
  const { ingredients, setIngredients } = useIngredients();

  return (
    <div>
      <h1>Your ingredients:</h1>
      <p>
        {ingredients.map((ingredient) => (
          <div>{ingredient}</div>
        ))}
      </p>
    </div>
  );
}
