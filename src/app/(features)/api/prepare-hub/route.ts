import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import axios from "axios";
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

    // const jobDescriptionUrl = formData.get("jobDescriptionUrl") as string;
    // const jobDescriptionResponse = await axios.get(jobDescriptionUrl);
    // const jobDescription = jobDescriptionResponse.data;
    const jobDescription =
      "Software engineer with 2-3 years of experience in building web applications using React and Node.js.";

    const resumeReponse = await db
      .select({ jsonResume: Resume.jsonResume, name: Resume.name })
      .from(Resume)
      .where(eq(Resume.id, parseInt(resumeId)));
    const resumeContent = resumeReponse[0].jsonResume;
    //console.log("jobDescription", jobDescription);

    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI Assistant who is an expert about Interview.
              Start Context: You are interviewing for a software engineering role at a top tech company base on my CV ${resumeContent} and ${jobDescription} End Context.
              Question: Generate 3 Interview questions and anwsers based on the context in Json Format.`,
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
        resumeId: parseInt(resumeId),
        userEmail: user.primaryEmailAddress?.emailAddress,
        resumeName: resumeReponse[0].name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    for (const qa of parsedResult) {
      await db
        .insert(QuestionAnswer)
        .values({
          interviewSetId: interviewSet[0].id,
          question: qa.question,
          answer: qa.answer,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .returning();
    }
    return new Response(
      JSON.stringify({ message: "Questions and answers inserted successfully" })
    );
  } catch (error) {
    console.error(error);
    return new Response("Error processing PDF", { status: 500 });
  }
}
