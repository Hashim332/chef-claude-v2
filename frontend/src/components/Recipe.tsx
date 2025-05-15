import { useRecipeContext } from "@/context/AppContext";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SaveRecipeButton from "./SaveRecipe";
import NewRecipeButton from "./NewRecipe";
import { SignedIn } from "@clerk/clerk-react";

export default function Recipe() {
  const { recipe } = useRecipeContext();

  if (!recipe) {
    return (
      <div className="max-w-2xl mx-auto my-8 prose">Loading recipe...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 prose">
      <>
        <h1 className="text-3xl mr-auto">Recipe:</h1>
        <h2 className="text-2xl">{recipe.recipeName}</h2>
        <h3 className="text-md font-normal">{recipe.quickSummary}</h3>
        <Markdown remarkPlugins={[remarkGfm]}>{recipe.fullRecipe}</Markdown>
        <div className="flex flex-row justify-evenly gap-8">
          <SignedIn>
            <SaveRecipeButton />
          </SignedIn>
          <NewRecipeButton />
        </div>
      </>
    </div>
  );
}
