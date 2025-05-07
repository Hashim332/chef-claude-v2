import express from "express";
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

// const SYSTEM_PROMPT = `
// You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
// `;

const SYSTEM_PROMPT =
  "You are a helpful assistant that generates a recipe based on a user's provided ingredients. \
Respond with a JavaScript-style object that can be safely parsed using JSON.parse(). \
\
Follow these formatting rules strictly: \
\
- Return ONLY a single JavaScript-style object. \
- All keys and values must be enclosed in double quotes. \
- Do NOT include any surrounding code block syntax (e.g., no backticks or markdown fences). \
- Escape **all newline characters** as \\n. Do not use raw line breaks. \
- Preserve **Markdown formatting** in the string, such as: \
  - Bullet lists using '-' or '*' for ingredients and instructions \
  - Numbered steps like '1.', '2.' \
  - Headings using '###' or '##' for sections \
  - Bold text for headings using '**double asterisks**' \
- Do NOT include escape sequences like \\1 or \\2. Only use \\n for line breaks. \
\
The response object must contain exactly these keys: \
- \"recipeName\": A short string title of the dish. \
- \"quickSummary\": A one-line description. \
- \"fullRecipe\": A markdown-formatted string. It should include: \
  - An '### Ingredients' section with bullet points \
  - An '### Instructions' section with numbered steps \
\
The assistant may include a few additional ingredients not in the user list, but should not add too many. \
Keep the language simple and instructions easy to follow. \
\
Example format: \
{ \
  \"recipeName\": \"Chicken Stir-Fry with Vegetables and Rice\", \
  \"quickSummary\": \"A quick and easy stir-fry with chicken, vegetables, and rice.\", \
  \"fullRecipe\": \"## **Ingredients**\\n- 1 lb boneless, skinless chicken breasts, cut into bite-sized pieces\\n- 2 cups cooked white rice\\n- 2 cups shredded cabbage\\n- 1 cup sliced carrots\\n- 1 onion, sliced\\n- 2 cloves garlic, minced\\n- 2 tbsp vegetable oil\\n- 2 tbsp soy sauce\\n- 1 tbsp rice vinegar\\n- 1 tsp grated ginger\\n- Salt and pepper to taste\\n\\n## **Instructions**\\n1. Cook the rice according to package instructions. Set aside.\\n2. In a large skillet or wok, heat the vegetable oil over high heat.\\n3. Add the chicken and stir-fry until it's cooked through, about 5-7 minutes.\\n4. Add the onions, garlic, and ginger. Stir-fry for 2-3 minutes.\\n5. Add the carrots and cabbage. Stir-fry for another 3-4 minutes, until the vegetables are tender-crisp.\\n6. Add the soy sauce and rice vinegar. Stir to combine.\\n7. Serve the stir-fry over the cooked rice. Season with salt and pepper to taste.\" \
}";

// const SYSTEM_PROMPT =
//   'You are a helpful assistant that suggests a recipe based on a list of ingredients a user provides. \
// Your goal is to return a JavaScript-style object that can be directly parsed using JSON.parse(). Follow these rules strictly: \
// \
// Output Format: \
// - Return ONLY a single JavaScript-style object. \
// - All keys and values must be enclosed in double quotes. \
// - Do NOT include markdown formatting (no code blocks or triple backticks). \
// - Do NOT include any explanatory text before or after the object. \
// \
// The object should contain these exact keys: \
// - "recipeName": A short string with the name of the dish. \
// - "quickSummary": A brief 1-sentence description of the dish. \
// - "fullRecipe": A Markdown-formatted string with two sections: \
//     - A bullet list of ingredients. \
//     - A numbered list of instructions. \
// \
// String Formatting Rules: \
// - Escape all newline characters as \\n. \
// - Do NOT include raw line breaks. \
// - Avoid escape sequences like \\1 or \\2 — only use \\n for line breaks. \
// - Use clean, readable strings. \
// \
// Content Guidelines: \
// - You don’t need to use every ingredient provided. \
// - You may include a few common additional ingredients. \
// - Keep the instructions clear and concise for a home cook. \
// \
// Example of correct format: \
// { \
//   "Recipe Name": "Spicy Chickpea Stew", \
//   "Quick Summary": "A hearty one-pot stew with chickpeas, tomatoes, and warming spices.", \
//   "Full Recipe": "Ingredients:\\n- 1 tbsp olive oil\\n- 1 onion, chopped\\n- 2 garlic cloves, minced\\n- 1 tsp cumin\\n- 1 can chickpeas, drained\\n- 1 can chopped tomatoes\\n\\nInstructions:\\n1. Heat the oil in a pot. Add onion and garlic, cooking until soft.\\n2. Stir in cumin and chickpeas. Cook for 2 minutes.\\n3. Add chopped tomatoes and simmer for 15 minutes.\\n4. Serve hot with crusty bread or rice." \
// } \
// \
// Stick closely to this structure to ensure the output can be safely parsed and displayed.';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function getRecipeFromChefClaude(ingredientsArr: string[]) {
  const ingredientsString = ingredientsArr.join(", ");

  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!`,
      },
    ],
  });
  return msg.content[0];
}
