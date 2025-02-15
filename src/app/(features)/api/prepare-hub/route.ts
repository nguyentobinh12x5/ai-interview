import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "../../../../../db";
import { InterviewSet, QuestionAnswer, Resume } from "../../../../../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await currentUser();
  const interviewSets = await db
    .select()
    .from(InterviewSet)
    .where(eq(InterviewSet.userEmail, user.primaryEmailAddress?.emailAddress));
  if (!interviewSets) {
    return new Response("No interview sets found");
  }
  return new Response(JSON.stringify(interviewSets));
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const formData = await req.formData();
    const resumeId = formData.get("resumeId") as string;
    const companyName = formData.get("companyName") as string;
    const jobDescription = formData.get("jobDescription") as string;
    const position = formData.get("position") as string;

    const resumeReponse = await db
      .select({ jsonResume: Resume.jsonResume, name: Resume.name })
      .from(Resume)
      .where(eq(Resume.id, parseInt(resumeId)));
    const resumeContent = resumeReponse[0].jsonResume;

    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI Assistant who is an expert about Interview.
              Start Context: You are interviewing for a software engineering role at a top tech company base on my CV ${resumeContent}, ${position} and ${jobDescription} End Context.
              Question: Generate 5 Interview questions and anwsers based on the context in Json Format.`,
            },
          ],
        },
      ],
    });
    const parsedResult = JSON.parse(
      result.text.replace("```json", "").replace("```", "")
    );
    const interviewSet = await db
      .insert(InterviewSet)
      .values({
        userEmail: user.primaryEmailAddress?.emailAddress,
        jobDescription: jobDescription,
        position: position,
        companyName: companyName,
        resumeName: resumeReponse[0].name,
        resumeId: parseInt(resumeId),
      })
      .returning();

    for (const qa of parsedResult) {
      await db
        .insert(QuestionAnswer)
        .values({
          question: qa.question,
          answer: qa.answer,
          interviewSetId: interviewSet[0].id,
        })
        .returning();
    }
    return new Response(
      JSON.stringify({
        message: "Questions and answers inserted successfully",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return new Response("Error processing PDF", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const interviewSetId = url.searchParams.get("Id");
  try {
    const result = await db
      .delete(InterviewSet)
      .where(eq(InterviewSet.id, parseInt(interviewSetId as string)));

    if (result.rowCount < 1) {
      return new Response("Not Interview Set", { status: 404 });
    }

    return new Response(JSON.stringify("Successfully deleted interview set"));
  } catch (error) {
    console.log(error);
    return new Response("Error processing request", { status: 500 });
  }
}
