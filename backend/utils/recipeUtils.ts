// Recipe parsing and processing utilities

/**
 * Clean up recipe text from Claude's response and convert to proper JSON
 * Handles common formatting issues like single quotes and backticks
 */
export function cleanAndParseRecipe(rawText: string) {
  // Replace single quotes with double quotes for valid JSON
  const doubleQuoted = rawText
    .replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":') // keys
    .replace(/:\s*'([^']+?)'/g, ': "$1"'); // simple string values

  // Remove backticks
  const noBackticks = doubleQuoted.replace(/`/g, "");

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
