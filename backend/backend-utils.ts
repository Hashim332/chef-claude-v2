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
