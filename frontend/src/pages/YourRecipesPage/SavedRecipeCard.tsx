import { useState } from "react";
import RecipeModal from "./RecipeModal";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function SavedRecipeCard() {
  const [showRecipe, setShowRecipe] = useState(false);

  return (
    <section>
      <div
        onClick={() => setShowRecipe(true)}
        className="border-1 my-4 flex flex-row justify-between hover:bg-secondary/10 w-full rounded-md p-4 hover:cursor-pointer"
      >
        <div>
          <h1 className="text-xl font-bold">Recipe name</h1>
          <p>Recipe description</p>
        </div>
        <Button
          className="bg-red-600 hover:bg-red-700 hover:cursor-pointer mt-4 font-bold text-md my-auto "
          // TODO: placeholder onclick, sync up with modal button
          onClick={(e) => {
            e.stopPropagation();
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
