import { useState } from "react";
import RecipeModal from "./RecipeModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function SavedRecipeCard() {
  const [showRecipe, setShowRecipe] = useState(false);

  return (
    <section>
      <div className="my-4 w-full rounded-md p-4 flex justify-between items-center">
        {/* Only this inner div is hoverable */}
        <div
          onClick={() => setShowRecipe(true)}
          className="flex flex-col border hover:bg-secondary/10 rounded-md p-2 w-full cursor-pointer transition-colors"
        >
          <h1 className="text-xl font-bold">Recipe name</h1>
          <p>Recipe description</p>
        </div>

        <Button
          className="ml-4 bg-tertiary text-secondary border hover:bg-red-500 hover:cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // still good practice
            console.log("recipe removed");
          }}
        >
          <Trash2 />
        </Button>
      </div>

      {showRecipe && <RecipeModal closeModal={() => setShowRecipe(false)} />}
    </section>
  );
}
