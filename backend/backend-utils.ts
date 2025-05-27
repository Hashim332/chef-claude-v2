import sharp from "sharp";
import heicConvert from "heic-convert";
import { error } from "console";

export function cleanAndParseRecipe(rawText: string) {
  // Step 1: Replace single quotes with double quotes (only around keys/values)
  const doubleQuoted = rawText
    .replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":') // keys
    .replace(/:\s*'([^']+?)'/g, ': "$1"'); // simple string values

  // Step 2: Remove backticks around the Full Recipe (convert to string with \n preserved)
  const noBackticks = doubleQuoted.replace(/`/g, ""); // Optional: keep markdown if you plan to render it

  // Step 3: Parse it
  try {
    return JSON.parse(noBackticks);
  } catch (err) {
    console.error("Failed to parse recipe:", err);
    return null;
  }
}

export type Recipe = {
  recipeId?: string;
  recipeName: string;
  quickSummary: string;
  fullRecipe: string;
};

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
 * Ensures the input buffer is a JPEG image.
 * Converts HEIC, PNG, WEBP, etc., to JPEG with memory-safe processing.
 * Automatically resizes large images to prevent memory issues.
 * @param inputBuffer The raw image buffer.
 * @returns A Promise resolving to an object with the JPEG buffer and its metadata.
 */
export async function ensureJpeg(
  inputBuffer: Buffer
): Promise<{ jpegBuffer: Buffer; metadata: sharp.Metadata }> {
  let sharpInstance = sharp(inputBuffer);
  let metadata: sharp.Metadata | undefined;

  try {
    metadata = await sharpInstance.metadata();
    console.log("Original metadata:", metadata);

    if (
      metadata.format === "jpeg" &&
      metadata.width &&
      metadata.height &&
      metadata.width * metadata.height < 4000000
    ) {
      return { jpegBuffer: inputBuffer, metadata };
    }

    if (metadata.format === "heif") {
      console.log("Converting HEIF using Sharp...");
      let pipeline = sharp(inputBuffer);

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

    if (
      metadata.format &&
      ["png", "webp", "tiff", "gif"].includes(metadata.format)
    ) {
      console.log(`Converting ${metadata.format} using Sharp...`);
      let pipeline = sharp(inputBuffer);

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
 * Processes JPEG images by automatically resizing and/or compressing to meet size constraints.
 * First attempts resizing if image exceeds dimension limits. If still over size limit after resizing,
 * applies JPEG compression using binary search to find optimal quality setting.
 *
 * @param {Buffer} inputBuffer - The raw image buffer to process
 * @returns {Promise<Buffer>} A Promise resolving to the processed JPEG buffer
 * @throws {Error} If image metadata cannot be retrieved or processing fails
 *
 * @example
 * // Process an image to be under 5MB and max dimension of 1200px
 * const processedBuffer = await compressJpeg(originalBuffer);
 */
export async function processJpeg(inputBuffer: Buffer): Promise<Buffer> {
  const maxSizeBytes = 5 * 1024 * 1024 * 0.66; // 5MB to limit
  const maxDimension = 1200;

  try {
    let buffer = inputBuffer;
    let metadata = await sharp(buffer).metadata();
    if (!metadata.size || !metadata.width || !metadata.height) {
      throw new Error("Failed to get complete metadata from image");
    }

    let currentSize = metadata.size;

    // check and resize before compressing
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

      // Update currentSize with the new size after resizing
      currentSize = metadata.size;

      console.log(
        `Resized image to fit within ${maxDimension}px, new size: ${currentSize} bytes`
      );
    }

    // Early return if size is now below the limit
    if (currentSize <= maxSizeBytes) {
      return buffer;
    }

    // Step 2: Apply JPEG compression with binary search to find optimal quality
    // Start with quality estimation based on current size vs target size
    let minQuality = 10;
    let maxQuality = 90;
    // uses ratio of current size : desired size to find quality to compress to
    let targetQuality = Math.min(
      maxQuality,
      Math.max(minQuality, Math.round((maxSizeBytes / currentSize) * 100))
    );

    let attempts = 0;
    const maxAttempts = 8;

    while (attempts < maxAttempts) {
      attempts++;

      // Compress the resized image with the current quality setting
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

      // Binary search adjustment
      if (compressedSize > maxSizeBytes) {
        maxQuality = targetQuality;
        targetQuality = Math.floor((minQuality + targetQuality) / 2);
      } else {
        minQuality = targetQuality;
        targetQuality = Math.ceil((targetQuality + maxQuality) / 2);
      }
    }

    // Final safeguard with lowest acceptable quality if binary search fails to produce sufficient quality reduction
    return await sharp(buffer).jpeg({ quality: minQuality }).toBuffer();
  } catch (err) {
    console.error("Error while compressing image:", err);
    throw err; // Re-throw to maintain Promise rejection
  }
}
