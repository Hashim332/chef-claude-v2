import { useRecipeContext } from "@/context/HomeContext";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Recipe() {
  const { recipe } = useRecipeContext();

  if (recipe.text === "" || !recipe.text) {
    return <div>Loading recipe...</div>;
  }

  const recipeExists = recipe.text !== "" && recipe.text;
  const random = "# Hi, *Pluto*!";

  return (
    <div className="max-w-2xl mx-auto my-8 prose">
      <h1 className="text-3xl my-4 mr-auto">Recipe:</h1>
      {recipeExists && (
        <Markdown remarkPlugins={[remarkGfm]}>{recipe.text}</Markdown>
      )}
      <Markdown>{random}</Markdown>
    </div>
  );
}
