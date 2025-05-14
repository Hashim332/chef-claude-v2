import IngredientForm from "@/components/IngredientForm";
import IngredientsList from "@/components/IngredientsList";
import Recipe from "@/components/Recipe";
import SendPrompt from "@/components/SendPrompt";
import { useRecipeContext } from "@/context/AppContext";
import { smoothScrollTo } from "@/utils/utils";
import { useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import FileUploader from "@/components/FileUploader";

export default function Home() {
  const { ingredients, recipe } = useRecipeContext();
  const enoughIngredients = ingredients.length >= 4;
  const recipeSection = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    if (recipeSection.current && recipe) {
      const top =
        recipeSection.current.getBoundingClientRect().top + window.scrollY;
      smoothScrollTo(top, 1000); // Scroll to the recipe over 1 second
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
            value="manual"
            className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=active]:rounded-md data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-600 data-[state=inactive]:shadow-none transition-all py-2 px-4 text-sm font-medium m-1"
          >
            Manual
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="p-4 rounded-b-lg">
          <FileUploader />
        </TabsContent>

        <TabsContent value="manual" className="p-4 rounded-b-lg">
          <IngredientForm />
          <IngredientsList />
        </TabsContent>
      </Tabs>

      {/* <FileUploader /> */}

      {enoughIngredients && <SendPrompt />}
      {recipe && (
        <div ref={recipeSection}>
          <Recipe />
        </div>
      )}
    </div>
  );
}
