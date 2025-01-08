"use server";
import { gemini15Flash, googleAI } from "@genkit-ai/googleai";
import { genkit, run, z } from "genkit";
import {
  devLocalIndexerRef,
  devLocalVectorstore,
  devLocalRetrieverRef,
} from "@genkit-ai/dev-local-vectorstore";
import { textEmbedding004, vertexAI } from "@genkit-ai/vertexai";
import { Document } from "genkit/retriever";
import { chunk } from "llm-chunk";
import { readFile } from "fs/promises";
import path from "path";
import pdf from "pdf-parse";
const menuPdfIndexer = devLocalIndexerRef("menuQA");
const menuRetriever = devLocalRetrieverRef("menuQA");

async function extractTextFromPdf(filePath: string) {
  const pdfFile = path.resolve(filePath);
  const dataBuffer = await readFile(pdfFile);
  const data = await pdf(dataBuffer);
  return data.text;
}

const chunkingConfig = {
  minLength: 1000,
  maxLength: 2000,
  splitter: "sentence",
  overlap: 100,
  delimiters: "",
} as any;

const MenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  calories: z.number(),
  allergens: z.array(z.string()),
});

const ai = genkit({
  plugins: [
    googleAI(),
    // vertexAI provides the textEmbedding004 embedder
    vertexAI(),

    // the local vector store requires an embedder to translate from text to vector
    devLocalVectorstore([
      {
        indexName: "menuQA",
        embedder: textEmbedding004,
      },
    ]),
  ],
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

export const indexMenu = ai.defineFlow(
  {
    name: "indexMenu",
    inputSchema: z.string().describe("PDF file path"),
    outputSchema: z.void(),
  },
  async (filePath: string) => {
    filePath = path.resolve(filePath);

    // Read the pdf.
    const pdfTxt = await run("extract-text", () =>
      extractTextFromPdf(filePath)
    );

    // Divide the pdf text into segments.
    const chunks = await run("chunk-it", async () =>
      chunk(pdfTxt, chunkingConfig)
    );

    // Convert chunks of text into documents to store in the index.
    const documents = chunks.map((text) => {
      return Document.fromText(text, { filePath });
    });

    // Add documents to the index.
    await ai.index({
      indexer: menuPdfIndexer,
      documents,
    });
  }
);

export const menuQAFlow = ai.defineFlow(
  { name: "menuQA", inputSchema: z.string(), outputSchema: z.string() },
  async (input: string) => {
    // retrieve relevant documents
    const docs = await ai.retrieve({
      retriever: menuRetriever,
      query: input,
      options: { k: 3 },
    });

    // generate a response
    const { text } = await ai.generate({
      prompt: `
You are acting as a helpful AI assistant that can answer 
questions about the food available on the menu at Genkit Grub Pub.

Use only the context provided to answer the question.
If you don't know, do not make up an answer.
Do not add or change items on the menu.

Question: ${input}`,
      docs,
    });

    return text;
  }
);
