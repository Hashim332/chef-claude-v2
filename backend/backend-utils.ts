import sharp from "sharp";

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

interface CompressOptions {
  startQuality?: number; // default: 80
  minQuality?: number; // default: 30
  step?: number; // default: 10
}

/**
 * Compresses an image buffer until it's under maxBytes,
 * reducing JPEG quality in steps.
 *
 * @param buffer - The original image buffer
 * @param maxBytes - Maximum allowed size in bytes (e.g., 5 * 1024 * 1024 for 5MB)
 * @param options - Optional quality settings
 * @returns A Promise resolving with a compressed image buffer
 * @throws If the image cannot be compressed under maxBytes
 */

export async function compressImage(
  buffer: Buffer,
  maxBytes: number,
  options: CompressOptions = {}
): Promise<Buffer> {
  if (buffer.length <= maxBytes) return buffer;

  const { startQuality = 80, minQuality = 30, step = 10 } = options;
  let quality = startQuality;
  let output: Buffer = buffer;

  while (quality >= minQuality) {
    console.log("image is processing step number: ", step);
    output = await sharp(buffer).jpeg({ quality }).toBuffer();

    if (output.length <= maxBytes) {
      console.log(`Compressed to ${output.length} bytes at quality=${quality}`);
      return output;
    }

    quality -= step;
  }

  throw new Error(
    `Unable to compress image under ${maxBytes} bytes (min quality reached)`
  );
}
