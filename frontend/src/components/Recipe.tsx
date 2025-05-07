import { useRecipeContext } from "@/context/AppContext";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Recipe() {
  const { recipe, ingredients } = useRecipeContext();

  if (!recipe) {
    return <div>Loading recipe...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 prose">
      {ingredients.length > 0 ? (
        <>
          <h1 className="text-3xl my-4 mr-auto">Recipe:</h1>
          <h2 className="text-2xl">{recipe.recipeName}</h2>
          <h3 className="text-md font-normal">{recipe.quickSummary}</h3>
          <Markdown remarkPlugins={[remarkGfm]}>{recipe.fullRecipe}</Markdown>
        </>
      ) : null}
    </div>
  );
}
