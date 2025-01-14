import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { PDFSource, getPDFContent } from "@/lib/pdf-loader";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get the content of the PDF
    const pdfSource: PDFSource = { type: "buffer", source: buffer };
    const content = await getPDFContent(pdfSource);

    // const result = streamText({
    //   model: google("gemini-1.5-pro-latest"),
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are an AI Assistant who is an expert about Interview. Start Context: You are interviewing for a software engineering role at a top tech company base on my CV ${content} End Context. Question: Generate 10 Interview questions based on the context.`,
    //     },
    //   ],
    // });
    // console.log(result.toDataStreamResponse());
    // return result.toDataStreamResponse();
    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI Assistant who is an expert about Interview. Start Context: You are interviewing for a software engineering role at a top tech company base on my CV ${content} End Context. Question: Generate 10 Interview questions based on the context.`,
            },
          ],
        },
      ],
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
    return new Response("Error processing PDF", { status: 500 });
  }
}
