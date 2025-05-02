import { useRecipeContext } from "@/context/HomeContext";
import Markdown from "react-markdown";

export default function Recipe() {
  const { recipe } = useRecipeContext();
  console.log(recipe.text);
  return (
    <div className="max-w-2xl mx-auto my-8">
      <h1 className="text-3xl my-4 mr-auto">Recipe:</h1>

      <Markdown>{recipe.text}</Markdown>
    </div>
  );
}
