import IngredientForm from "@/components/IngredientForm";
import IngredientsList from "@/components/IngredientsList";
import SendPrompt from "@/components/SendPrompt";
import { useIngredients } from "@/context/HomeContext";

export default function Home() {
  const { ingredients } = useIngredients();
  const enoughIngredients = ingredients.length >= 4;
  return (
    <div>
      <IngredientForm />
      <IngredientsList />
      {enoughIngredients && <SendPrompt />}
    </div>
  );
}
