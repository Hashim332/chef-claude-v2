import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type RecipeModalProps = {
  closeModal: () => void;
  recipeName: string;
  fullRecipe: string;
  deleteRecipe: (arg0: string) => void;
};

export default function RecipeModal({
  closeModal,
  recipeName,
  fullRecipe,
  deleteRecipe,
}: RecipeModalProps) {
  return (
    <div
      className="fixed inset-0 bg-neutral-800/50 flex justify-center items-center"
      onClick={closeModal} // Clicks on the overlay trigger close
    >
      <div
        className="bg-white p-6 rounded shadow-lg relative w-[80%] h-[75%] overflow-y-scroll scrollbar-visible"
        onClick={(e) => e.stopPropagation()} // Prevents modal click from closing
      >
        <X
          size={20}
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-primary transition-colors cursor-pointer"
        />
        <h2 className="text-xl font-bold mb-4 text-primary underline">
          {recipeName}
        </h2>
        <div className="text-sm leading-relaxed text-xl">
          <Markdown remarkPlugins={[remarkGfm]}>{fullRecipe}</Markdown>
        </div>
        <Button
          onClick={() => {
            deleteRecipe(recipeName);
            closeModal();
          }}
          className="bg-red-600 hover:bg-red-700 hover:cursor-pointer mt-8 w-full sm:max-w-30 font-bold text-md"
        >
          Delete
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
