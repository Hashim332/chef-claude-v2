import { useRecipeContext } from "@/context/HomeContext";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Recipe() {
  const { recipe } = useRecipeContext();

  if (recipe.text === "" || !recipe.text) {
    return <div>Loading recipe...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto my-8 prose">
      <h1 className="text-3xl my-4 mr-auto">Recipe:</h1>
      <Markdown remarkPlugins={[remarkGfm]}>{recipe.text}</Markdown>
    </div>
  );
}
