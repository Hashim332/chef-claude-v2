import IngredientForm from "@/components/IngredientForm";
import IngredientsList from "@/components/IngredientsList";
import Recipe from "@/components/Recipe";
import SendPrompt from "@/components/SendPrompt";
import { useRecipeContext } from "@/context/AppContext";
import { useCallback, useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import FileUploader from "@/components/FileUploader";

export default function Home() {
  const { ingredients, recipe } = useRecipeContext();
  const enoughIngredients = ingredients.length >= 4;
  const [hasScrolled, setHasScrolled] = useState(false);

  // Callback ref pattern - more reliable than useRef for this case
  const scrollToRecipe = useCallback(
    (node: HTMLDivElement | null) => {
      // This function runs whenever the ref is attached
      if (node && recipe && !hasScrolled) {
        // Add a small delay to ensure rendering is complete
        setTimeout(() => {
          node.scrollIntoView({ behavior: "smooth" });
          setHasScrolled(true);
        }, 100);
      }
    },
    [recipe, hasScrolled]
  );

  // Reset scroll flag when recipe changes
  useEffect(() => {
    if (!recipe) {
      setHasScrolled(false);
    }
  }, [recipe]);

  return (
    <div>
      <Tabs
        defaultValue="image"
        className="w-full max-w-xl border rounded-lg shadow-md overflow-hidden m-auto my-4"
      >
        <TabsList className="flex w-full justify-start bg-secondary/10 rounded-t-lg border-b border-gray-200 p-1">
          <TabsTrigger
            value="image"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:rounded-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:shadow-none transition-all py-2 px-4 text-sm font-medium m-1"
          >
            Image
          </TabsTrigger>
          <TabsTrigger
            value="ingredients"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:rounded-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:shadow-none transition-all py-2 px-4 text-sm font-medium m-1"
          >
            Ingredients
          </TabsTrigger>
        </TabsList>

        {/* by image */}
        <TabsContent value="image" className="p-4 rounded-b-lg">
          <FileUploader />
        </TabsContent>

        {/* by ingredient */}
        <TabsContent value="ingredients" className="p-4 rounded-b-lg">
          <IngredientForm />
          <IngredientsList />
        </TabsContent>
      </Tabs>

      {enoughIngredients && <SendPrompt />}

      {recipe && (
        <div ref={scrollToRecipe}>
          <Recipe />
        </div>
      )}
    </div>
  );
}
