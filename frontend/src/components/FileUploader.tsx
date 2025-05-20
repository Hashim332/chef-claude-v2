import { ChangeEvent, use, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { ArrowRight, Upload, X } from "lucide-react";
import { useRecipeContext } from "@/context/AppContext";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const { file, setFile, preview, setPreview, setRecipe, recipe } =
    useRecipeContext();

  const inputRef = useRef<HTMLInputElement | null>(null); // <-- file input ref
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  // const [error, setError] = useState<string>("");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      // clientside filesize check
      if (selectedFile) {
        const maxSizeInBytes = 15 * 1024 * 1024;

        if (selectedFile.size > maxSizeInBytes) {
          setStatus("error");
          // setTimeout(() => setStatus("idle"), 3000);

          setErrorMessage(`File is too large. Max size is 15MB.`);
          setTimeout(() => setErrorMessage(""), 3000);
          return;
        }

        console.log("File is within size limit:", selectedFile);
      }
      // size check passed
      setFile(selectedFile);

      // preview handling
      if (preview) {
        URL.revokeObjectURL(preview);
      }
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      setStatus("idle");
      // setErrorMessage("");
    } else {
      setFile(null);
      setPreview(null);
      setStatus("idle");
    }
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    // setErrorMessage("");

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/generate/by-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      // axios res is slightly diffrent to built in, using res.data as per docs
      setStatus("success");
      setRecipe(res.data);
    } catch (err: any) {
      setStatus("error");

      // Try to extract meaningful info from API response
      const apiError = err.response?.data;
      let message = "Failed to upload image";

      if (apiError) {
        if (apiError.error && apiError.code) {
          // Format with code and message
          message = `${apiError.code}: ${apiError.error}`;
        } else if (apiError.error) {
          message = apiError.error;
        } else if (typeof apiError === "string") {
          message = apiError;
        }
      } else if (err.message) {
        message = err.message;
      }

      setErrorMessage(message);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  }

  // Clear input manually when recipe is reset
  useEffect(() => {
    if (!recipe && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [recipe]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  console.log("error message -->", errorMessage);
  console.log("status -->", status);

  return (
    <div className="">
      <div>
        <h1 className="text-4xl mb-4">
          Upload a picture of your ingredients to get a recipe!
        </h1>
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-500 transition duration-200 ease-in-out text-center"
        >
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          {file ? (
            <p className="text-sm text-gray-700">
              Selected file: <span className="font-medium">{file.name}</span>
            </p>
          ) : (
            <>
              <p className="mb-1 text-sm text-gray-600">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">
                JPG, PNG, or GIF (Max 5MB)
              </p>
            </>
          )}
        </label>
        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      {preview && status !== "success" && (
        <div className="mt-4 relative flex justify-center">
          <img
            src={preview}
            alt="Preview of selected image"
            className="max-w-full max-h-64 rounded-md object-contain border border-gray-200 p-1 shadow-sm"
          />
          <button
            onClick={() => {
              setFile(null);
              if (preview) URL.revokeObjectURL(preview);
              setPreview(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="absolute top-2 right-2 bg-white border border-gray-300 rounded-full p-1 hover:bg-red-100 transition hover:cursor-pointer"
            title="Remove image"
          >
            <X size={16} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>
      )}

      {file && status !== "success" && (
        <Button
          onClick={handleFileUpload}
          className="w-full mt-4 hover:cursor-pointer"
          disabled={status === "uploading"}
        >
          {status === "uploading" ? (
            <>
              <span className="animate-pulse">Creating recipe</span>
              <span className="animate-bounce">...</span>
            </>
          ) : (
            <>
              Get Recipe
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </Button>
      )}
      <div className="text-red-600 text-sm mt-2 text-center">
        {status === "error" && <p>{errorMessage}</p>}
      </div>
    </div>
  );
}
