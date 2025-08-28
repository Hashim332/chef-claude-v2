import sharp from "sharp";

export interface CompressOptions {
  startQuality?: number;
  minQuality?: number;
  step?: number;
  maxWidth?: number;
  maxHeight?: number;
}

// /**
//  * Ensures the input buffer is a JPEG image.
//  * Converts HEIC, PNG, WEBP, etc., to JPEG.
//  * If input is already JPEG, it's returned as is.
//  * @param inputBuffer The raw image buffer.
//  * @returns A Promise resolving to an object with the JPEG buffer and its metadata.
//  */
// export async function ensureJpeg(
//   inputBuffer: Buffer
// ): Promise<{ jpegBuffer: Buffer; metadata: sharp.Metadata }> {
//   let sharpInstance = sharp(inputBuffer);
//   let metadata: sharp.Metadata;

//   try {
//     metadata = await sharpInstance.metadata();
//     console.log(metadata);

//     if (metadata.format && metadata.format === "jpeg") {
//       return { jpegBuffer: inputBuffer, metadata };
//     }

//     if (metadata.format && metadata.format === "heif") {
//       const convert = require("heic-convert");
//       const outputBuffer = await convert({
//         buffer: inputBuffer,
//         format: "JPEG",
//         quality: 1,
//       });
//       return { jpegBuffer: outputBuffer, metadata };
//     }

//     // if none of the  conditions are met, throw error
//     throw new Error(`Unsupported image format: ${metadata.format}`);
//   } catch (err) {
//     console.error("error while running ensureJpeg: ", err);
//     throw err; // Re-throw the error to maintain the Promise rejection
//   }
// }

/**
 * Convert any image format to JPEG using Sharp
 * Handles HEIC, PNG, WEBP, etc. with automatic resizing for large images
 */
export async function ensureJpeg(
  inputBuffer: Buffer
): Promise<{ jpegBuffer: Buffer; metadata: sharp.Metadata }> {
  let sharpInstance = sharp(inputBuffer);
  let metadata: sharp.Metadata | undefined;

  try {
    metadata = await sharpInstance.metadata();
    console.log("Original metadata:", metadata);

    // If its already a small JPEG, return
    if (
      metadata.format === "jpeg" &&
      metadata.width &&
      metadata.height &&
      metadata.width * metadata.height < 4000000
    ) {
      return { jpegBuffer: inputBuffer, metadata };
    }

    // Handle HEIC/HEIF images
    if (metadata.format === "heif") {
      console.log("Converting HEIF using Sharp...");
      let pipeline = sharp(inputBuffer);

      // Resize if image is too large
      if (metadata.width && metadata.height) {
        const totalPixels = metadata.width * metadata.height;
        if (totalPixels > 4000000) {
          const scale = Math.sqrt(4000000 / totalPixels);
          const newWidth = Math.round(metadata.width * scale);
          const newHeight = Math.round(metadata.height * scale);
          console.log(
            `Resizing from ${metadata.width}x${metadata.height} to ${newWidth}x${newHeight}`
          );
          pipeline = pipeline.resize(newWidth, newHeight, {
            fit: "inside",
            withoutEnlargement: true,
          });
        }
      }

      const jpegBuffer = await pipeline
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
      console.log(
        `HEIF conversion complete. Output size: ${jpegBuffer.length} bytes`
      );
      return { jpegBuffer, metadata };
    }

    // Handle other common formats (PNG, WEBP, TIFF, GIF)
    if (
      metadata.format &&
      ["png", "webp", "tiff", "gif"].includes(metadata.format)
    ) {
      console.log(`Converting ${metadata.format} using Sharp...`);
      let pipeline = sharp(inputBuffer);

      // Same resizing logic for other formats
      if (metadata.width && metadata.height) {
        const totalPixels = metadata.width * metadata.height;
        if (totalPixels > 4000000) {
          const scale = Math.sqrt(4000000 / totalPixels);
          const newWidth = Math.round(metadata.width * scale);
          const newHeight = Math.round(metadata.height * scale);
          console.log(
            `Resizing from ${metadata.width}x${metadata.height} to ${newWidth}x${newHeight}`
          );
          pipeline = pipeline.resize(newWidth, newHeight, {
            fit: "inside",
            withoutEnlargement: true,
          });
        }
      }

      const jpegBuffer = await pipeline
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();
      console.log(
        `${metadata.format} conversion complete. Output size: ${jpegBuffer.length} bytes`
      );
      return { jpegBuffer, metadata };
    }

    throw new Error(`Unsupported image format: ${metadata.format}`);
  } catch (err: any) {
    console.error("Error in ensureJpeg:", err.message);

    // Last resort: try to convert anyway with aggressive resizing 😭
    try {
      console.log("Attempting fallback conversion with Sharp...");
      const jpegBuffer = await sharp(inputBuffer)
        .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      console.log("Fallback conversion successful");
      return { jpegBuffer, metadata: metadata ?? ({} as sharp.Metadata) };
    } catch (fallbackErr: any) {
      console.error("Fallback conversion also failed:", fallbackErr.message);
      throw new Error(`Image conversion failed: ${err.message}`);
    }
  }
}

/**
 * Smart JPEG compression: resize first, then compress if needed
 * Uses binary search to find the best quality setting
 */
export async function processJpeg(inputBuffer: Buffer): Promise<Buffer> {
  const maxSizeBytes = 5 * 1024 * 1024 * 0.66; // Target: ~3.3MB
  const maxDimension = 1200; // Max width/height

  try {
    let buffer = inputBuffer;
    let metadata = await sharp(buffer).metadata();
    if (!metadata.size || !metadata.width || !metadata.height) {
      throw new Error("Failed to get complete metadata from image");
    }

    let currentSize = metadata.size;

    // Resize if image is too large
    if (currentSize > maxSizeBytes) {
      buffer = await sharp(inputBuffer)
        .resize({
          width: maxDimension,
          height: maxDimension,
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();

      // Get updated metadata after resize
      metadata = await sharp(buffer).metadata();
      if (!metadata.size) {
        throw new Error("Failed to get size after resizing");
      }

      currentSize = metadata.size;

      console.log(
        `Resized image to fit within ${maxDimension}px, new size: ${currentSize} bytes`
      );
    }

    // If resizing fixed the size issue, we're done
    if (currentSize <= maxSizeBytes) {
      return buffer;
    }

    // Apply JPEG compression with binary search
    let minQuality = 10;
    let maxQuality = 90;

    // Estimate starting quality based on current vs target size
    let targetQuality = Math.min(
      maxQuality,
      Math.max(minQuality, Math.round((maxSizeBytes / currentSize) * 100))
    );

    let attempts = 0;
    const maxAttempts = 8;

    // Binary search for optimal quality setting
    while (attempts < maxAttempts) {
      attempts++;

      const compressedBuffer = await sharp(buffer)
        .jpeg({ quality: targetQuality })
        .toBuffer();

      const compressedSize = compressedBuffer.length;
      console.log(
        `Attempt ${attempts}: Quality ${targetQuality}, Size: ${compressedSize} bytes`
      );

      // Check if we're within acceptable range
      if (
        compressedSize <= maxSizeBytes ||
        Math.abs(maxQuality - minQuality) <= 3
      ) {
        return compressedBuffer;
      }

      // Adjust quality range based on result
      if (compressedSize > maxSizeBytes) {
        maxQuality = targetQuality;
        targetQuality = Math.floor((minQuality + targetQuality) / 2);
      } else {
        minQuality = targetQuality;
        targetQuality = Math.ceil((targetQuality + maxQuality) / 2);
      }
    }

    // Final attempt with lowest acceptable quality
    return await sharp(buffer).jpeg({ quality: minQuality }).toBuffer();
  } catch (err) {
    console.error("Error while compressing image:", err);
    throw err;
  }
}
