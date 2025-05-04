import { X } from "lucide-react";

export default function RecipeModal({
  closeModal,
}: {
  closeModal: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-blur bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg relative">
        <X
          size={16}
          onClick={closeModal}
          className="absolute top-2 right-2 text-gray-500"
        >
          ✕
        </X>
        <h2 className="text-xl font-bold">Modal Title</h2>
        <p>Modal content goes here.</p>
      </div>
    </div>
  );
}
