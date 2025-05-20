import express from "express";
import multer from "multer";
import { ensureJpeg, processJpeg } from "../backend-utils";
import { getRecipeFromImage } from "../src/claudePrompt";

const router = express.Router();

class ImageProcessingError extends Error {
  constructor(public code: string, public status: number, message: string) {
    super(message);
  }
}

router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit to support newer phone cameras
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.post("/generate/by-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    res.status(400).json({
      error: "Invalid request: image file is required.",
    });
    return;
  }

  try {
    console.log(
      "Received image:",
      req.file.originalname,
      "Size:",
      req.file.size,
      "bytes"
    );

    // Access the file buffer
    const originalName = req.file.originalname;
    console.log(
      `Received image: ${originalName}, size: ${req.file.size} bytes`
    );

    // Step 1: Ensure JPEG format
    const { jpegBuffer } = await ensureJpeg(req.file.buffer);

    // Step 2: Resize/compress to meet size constraints
    const processedBuffer = await processJpeg(jpegBuffer);

    // Step 3: Convert to Base64 for API transmission
    const base64Image = processedBuffer.toString("base64");
    const approxPayloadSize = Buffer.byteLength(base64Image, "utf8");
    console.log(`Base64 payload size: ${approxPayloadSize} bytes`);

    // Adjust payload limit to account for base64 overhead (~1.5× expansion)
    const MAX_RAW_BYTES = 5 * 1024 * 1024; // 5 MB
    const MAX_PAYLOAD_BYTES = Math.floor(MAX_RAW_BYTES * 0.66); // ~3.3 MB

    if (approxPayloadSize > MAX_PAYLOAD_BYTES) {
      throw new ImageProcessingError(
        "PAYLOAD_TOO_LARGE",
        413,
        `Image payload is too large after Base64 encoding: ${(
          approxPayloadSize /
          (1024 * 1024)
        ).toFixed(2)}MB (max ${(MAX_PAYLOAD_BYTES / (1024 * 1024)).toFixed(
          2
        )}MB)`
      );
    }

    // Send to anthropic API
    const recipe = await getRecipeFromImage(base64Image);

    if (recipe.type === "text") {
      const recipeObject = JSON.parse(recipe.text);
      res.status(200).json(recipeObject);
    }
  } catch (err) {
    console.error("server error", err);
  }
});

export default router;
