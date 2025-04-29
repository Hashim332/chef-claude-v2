import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useIngredients } from "@/context/HomeContext";

export default function IngredientForm() {
  const [input, setInput] = useState<string>("");
  const { ingredients, setIngredients } = useIngredients();
  console.log(ingredients);

  const REMOVE_DISALLOWED_REGEX = /[^a-zA-Z]/g;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanedValue = e.target.value.replace(REMOVE_DISALLOWED_REGEX, "");
    setInput(cleanedValue);
  }

  function handleClick() {
    setIngredients((prevIngredients) => [...prevIngredients, input]);
    setInput("");
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-4xl">Enter some ingredients to get started</h1>
      <div className="flex gap-5">
        <Input
          value={input}
          onChange={handleChange}
          placeholder="e.g Pasta"
          className="w-xs !text-lg"
        />
        <Button onClick={handleClick} className="text-md">
          + Add ingredient
        </Button>
      </div>
    </div>
  );
}
