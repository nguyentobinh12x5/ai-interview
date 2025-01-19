import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const content = await req.json();
  try {
    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI Assistant who is an expert about Interview.
              Start Context: You are interviewing at company base on question ${content} End Context.
              Question: Anwser this questions based on the context.`,
            },
          ],
        },
      ],
    });
    return new Response(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    return new Response("Error when connect with server", { status: 500 });
  }
}
