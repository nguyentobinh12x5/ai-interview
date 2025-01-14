import { DataAPIClient } from "@datastax/astra-db-ts";
import { embed, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_APPLICATION_TOKEN,
  ASTRA_DB_API_ENDPOINT,
} = process.env;

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  const { messages } = await req.json();
  const latesMessage = messages[messages?.length - 1]?.content;
  let docContext = "";

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: latesMessage,
  });

  try {
    const collection = await db.collection(ASTRA_DB_COLLECTION);
    const cursor = collection.find(null, {
      sort: {
        $vector: embedding,
      },
      limit: 10,
    });
    const documents = await cursor.toArray();
    const docsMap = documents?.map((doc) => doc.text);
    docContext = JSON.stringify(docsMap);
  } catch (err) {
    console.error(err);
  }
  const template = {
    role: "system",
    content: `You are an AI Assistant who are expert about Interview if the context doesn't include any information you need anwser based on your existing knowledge Start Context ${docContext} End Context Question: ${latesMessage}`,
  };
  const response = streamText({
    model: openai("gpt-4o"),
    messages: [template, ...messages],
  });
  return response.toDataStreamResponse();
}
