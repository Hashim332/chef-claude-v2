import { useRecipeContext } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export default function NewRecipeButton() {
  const { resetAll } = useRecipeContext();

  return (
    <Button
      onClick={resetAll}
      variant="outline"
      className="text-xl hover:cursor-pointer"
    >
      New Recipe
    </Button>
  );
}
