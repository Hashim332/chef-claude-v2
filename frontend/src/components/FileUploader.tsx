import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { ArrowRight } from "lucide-react";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      console.log(e.target.files);
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
    }

    // Create and set preview URL
  }

  async function handleFileUpload() {
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/generate/by-image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setStatus("success");
      const data = res.data;
      console.log(data);
    } catch (err) {
      console.error("error with file upload to backend: ", err);
      setStatus("error");
      // setErrorMessage(err.response?.data?.error || "Failed to upload image"); FIXME: typescript error here
    }
  }

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        className="bg-white border-1"
        onChange={handleFileChange}
      />

      {/* preview image */}
      {preview && (
        <div className="mt-4">
          <p className="text-sm mb-2">Preview:</p>
          <img
            src={preview}
            alt="Preview"
            className="max-w-xs max-h-64 rounded object-cover"
          />
        </div>
      )}

      {file && (
        <Button onClick={handleFileUpload}>
          {status === "uploading" ? (
            <>
              <span className="animate-pulse">Creating recipe</span>
              <span className="animate-bounce">...</span>
            </>
          ) : (
            <>
              Get Recipe
              <ArrowRight size={18} />
            </>
          )}
        </Button>
      )}

      {status === "error" && (
        <div className="text-red-600">
          <p>Error: {errorMessage || "Failed to process image"}</p>
        </div>
      )}
    </div>
  );
}
