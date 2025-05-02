import IngredientForm from "@/components/IngredientForm";
import IngredientsList from "@/components/IngredientsList";
import Recipe from "@/components/Recipe";
import SendPrompt from "@/components/SendPrompt";
import { useRecipeContext } from "@/context/HomeContext";

export default function Home() {
  const { ingredients, recipe } = useRecipeContext();
  const enoughIngredients = ingredients.length >= 4;
  return (
    <div>
      <IngredientForm />
      <IngredientsList />
      {enoughIngredients && <SendPrompt />}
      {recipe.text && <Recipe />}
    </div>
  );
}
