import express from "express";
import multer from "multer";
import { ensureJpeg, processJpeg } from "../backend-utils";

const router = express.Router();

// Multer setup with stricter limits for Railway
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Reduced to 10MB for Railway
    files: 1,
  },
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
  let processingStartTime = Date.now();

  try {
    console.log("Hit /api/preview route");
    console.log(`File size: ${req.file?.size} bytes`);
    console.log(`File type: ${req.file?.mimetype}`);

    if (!req.file) {
      res.status(400).json({
        error: "NO_FILE_UPLOADED",
        message: "Image file is required for preview.",
      });
      return;
    }

    // Check file size in memory
    if (req.file.size > 10 * 1024 * 1024) {
      res.status(413).json({
        error: "FILE_TOO_LARGE",
        message: "Image file must be under 10MB.",
      });
      return;
    }

    console.log("Starting image conversion...");

    // Add timeout wrapper for ensureJpeg
    const conversionPromise = ensureJpeg(req.file.buffer);
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Image conversion timeout")), 25000);
    });

    const { jpegBuffer } = (await Promise.race([
      conversionPromise,
      timeoutPromise,
    ])) as any;

    const processingTime = Date.now() - processingStartTime;
    console.log(`Image conversion completed in ${processingTime}ms`);
    console.log(`Output JPEG size: ${jpegBuffer.length} bytes`);

    // Return the converted JPEG
    res.set("Content-Type", "image/jpeg");
    res.set("Content-Length", jpegBuffer.length.toString());
    res.send(jpegBuffer);
  } catch (err: any) {
    const processingTime = Date.now() - processingStartTime;
    console.error(
      `Preview conversion error after ${processingTime}ms:`,
      err.message
    );

    if (!res.headersSent) {
      res.status(500).json({
        error: "PREVIEW_ERROR",
        message: err.message || "Failed to generate preview.",
      });
    }
  }
});

export default router;
