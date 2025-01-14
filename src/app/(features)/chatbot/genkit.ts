"use server";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import { genkit, z } from "genkit";

const MenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  calories: z.number(),
  allergens: z.array(z.string()),
});

const ai = genkit({
  plugins: [googleAI()],
  model: gemini15Flash,
});

export const menuSuggestionFlow = ai.defineFlow(
  {
    name: "menuSuggestionFlow",
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (restaurantTheme) => {
    const { text } = await ai.generate({
      model: gemini15Flash,
      prompt: `Invent a menu item for a ${restaurantTheme} themed restaurant.`,
      output: { schema: MenuItemSchema },
    });
    return text;
  }
);
