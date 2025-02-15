import { streamText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";
import { findRelevantContent } from "@/lib/embedding";
import { currentUser } from "@clerk/nextjs/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const user = await currentUser();
  const { messages } = await req.json();
  try {
    const result = streamText({
      model: google("gemini-1.5-pro-latest"),
      messages,
      system: `You are a helpful interview assistant. 
        Use tools on every request.
        Be sure to getInformation from your knowledge base before answering any questions.
        If you are unsure, use the getInformation tool and you can use common sense to reason based on the information you do have.
        Respond as Interviewee`,
      tools: {
        getInformation: tool({
          description: `get information from your knowledge base to answer questions.`,
          parameters: z.object({
            question: z.string().describe("the users question"),
          }),
          execute: async ({ question }) =>
            await findRelevantContent(
              question,
              user.primaryEmailAddress?.emailAddress
            ),
        }),
      },
    });
    return result.toDataStreamResponse();
  } catch (error) {
    console.error(error);
    return new Response("Error when connect with server", { status: 500 });
  }
}
