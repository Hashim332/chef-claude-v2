import { Button } from "./ui/button";

export default function SaveRecipeButton() {
  function SaveRecipe() {
    console.log("Saved your recipe!");
  }
  return (
    <Button onClick={SaveRecipe} className="text-xl hover:cursor-pointer">
      Save Recipe
    </Button>
  );
}
