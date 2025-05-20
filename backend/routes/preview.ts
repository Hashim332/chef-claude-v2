import express from "express";
import multer from "multer";
import { ensureJpeg } from "../backend-utils";

const router = express.Router();

// Parse JSON bodies (not strictly needed for binary preview but kept for consistency)
router.use(express.json());

// Multer setup: in-memory storage, file size limit, image-only filter
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

/**
 * POST /preview
 * Converts uploaded image (including HEIC/PNG/WebP) to JPEG and returns it directly.
 */
router.post("/preview", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({
        error: "NO_FILE_UPLOADED",
        message: "Image file is required for preview.",
      });
      return;
    }

    // Step: Ensure JPEG format (HEIC/PNG/WebP -> JPEG)
    const { jpegBuffer } = await ensureJpeg(req.file.buffer);

    // Return the converted JPEG without resizing
    res.set("Content-Type", "image/jpeg");
    res.send(jpegBuffer);
    return;
  } catch (err: any) {
    console.error("Preview conversion error:", err);
    res.status(500).json({
      error: "PREVIEW_ERROR",
      message: err.message || "Failed to generate preview.",
    });
  }
  return;
});

export default router;
