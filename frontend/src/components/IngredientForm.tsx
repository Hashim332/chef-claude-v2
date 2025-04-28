import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";

export default function IngredientForm() {
  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="text-4xl">Enter some ingredients to get started</h1>
      <div className="flex gap-5">
        <Input className="w-md" />
        <Button>+ Add ingredient</Button>
      </div>
    </div>
  );
}
