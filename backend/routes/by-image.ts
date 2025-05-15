import express from "express";
import multer from "multer";
import { compressImage } from "../backend-utils";
import { getRecipeFromImage } from "../src/claudePrompt";

const router = express.Router();

router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 7MB limit
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
    let imageBuffer = req.file.buffer;

    const MAX_SAFE_BUFFER_SIZE = Math.floor((5 * 1024 * 1024) / 2); // compress image due to base64 adding 33% size
    imageBuffer = await compressImage(imageBuffer, MAX_SAFE_BUFFER_SIZE);

    const base64Image = imageBuffer.toString("base64");
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
