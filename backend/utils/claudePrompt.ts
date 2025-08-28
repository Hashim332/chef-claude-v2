import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";

// TODO: add some user input validation, if the entered "ingredients" is not actually
// a list of ingredients, return an error message and limit token usage

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

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function getRecipeFromIngredients(ingredientsArr: string[]) {
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

export async function getRecipeFromImage(image: string) {
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: image, // Base64-encoded image data as string
            },
          },
          {
            type: "text",
            text: "This is a picture of my fridge, I want to use the ingredients in here to make a meal. Please give me a recipe you'd recommend I make!",
          },
        ],
      },
    ],
  });
  return msg.content[0];
}
