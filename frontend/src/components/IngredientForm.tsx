import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useRecipeContext } from "@/context/AppContext";
import { AlertCircle, X, Plus } from "lucide-react";

export default function IngredientForm() {
  const [input, setInput] = useState<string>("");
  const [alert, setAlert] = useState<string>("");
  const { ingredients, setIngredients } = useRecipeContext();

  const REMOVE_DISALLOWED_REGEX = /[^a-zA-Z\s]/g;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanedValue = e.target.value.replace(REMOVE_DISALLOWED_REGEX, "");
    setInput(cleanedValue);
  }

  function validateInput() {
    if (!input) {
      setAlert("Please enter an ingredient");
      setTimeout(() => setAlert(""), 3000);
      return;
    }
    // parses the string to eliminate duplicates by capitalising the first letter and decapitalising all others
    const formattedInput =
      input[0].toUpperCase() + input.substring(1, input.length).toLowerCase();
    const isAdded = ingredients.includes(formattedInput);
    if (isAdded) {
      setAlert("This item is already in your list");
      setTimeout(() => setAlert(""), 3000);
    } else {
      setIngredients((prevIngredients) => [...prevIngredients, formattedInput]);
      setInput("");
    }
  }

  function handleClick() {
    validateInput();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      validateInput();
    }
  }

  return (
    <div className=" flex flex-col items-center gap-4 sm:mb-12">
      <h1 className="text-3xl md:text-4xl">
        Enter some ingredients to get a recipe
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full justify-center">
        <div className="relative">
          <Input
            value={input}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            placeholder="e.g Pasta"
            className=" md:w-xs !text-lg"
          />
          {alert && (
            <div className="absolute left-0 right-0 top-full mt-2 z-10">
              <div className="bg-pink-50 border border-pink-200 text-pink-700 rounded-lg px-3 py-2 shadow-md animate-in fade-in slide-in-from-top-1 duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AlertCircle
                      className="text-pink-500 mr-2 flex-shrink-0"
                      size={16}
                    />
                    <span className="text-sm">{alert}</span>
                  </div>
                  <button
                    onClick={() => setAlert("")}
                    className="sm:w-auto text-pink-400 hover:text-pink-600 transition-colors ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleClick} className="text-md hover:cursor-pointer">
          <Plus size={18} />
          Add ingredient
        </Button>
      </div>
    </div>
  );
}
