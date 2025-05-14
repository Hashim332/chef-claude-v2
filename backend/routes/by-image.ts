import express from "express";
import multer from "multer";
import { Recipe } from "../backend-utils";
import {
  getRecipeFromImage,
  getRecipeFromIngredients,
} from "../src/claudePrompt";

const router = express.Router();

router.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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
    const imageBuffer = req.file.buffer;
    const base64Image = req.file.buffer.toString("base64");
    console.log(base64Image);
    const recipe = await getRecipeFromImage(base64Image);
    // console.log(recipe);
    if (recipe.type === "text") {
      const recipeObject = JSON.parse(recipe.text);
      res.status(200).json(recipeObject);
    }
  } catch (err) {
    console.error("server error", err);
  }
});

export default router;
