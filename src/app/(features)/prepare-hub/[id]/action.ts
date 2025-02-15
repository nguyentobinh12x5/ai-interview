"use server";
import { eq } from "drizzle-orm";
import { db } from "../../../../../db";
import {
  InterviewSet,
  InterviewSetEmbeddings,
  QuestionAnswer,
  Resume,
} from "../../../../../db/schema";
import { generateEmbeddings } from "@/lib/embedding";
import { currentUser } from "@clerk/nextjs/server";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const createEmbeddingsForInterviewSet = async (
  interviewSetId: number
) => {
  try {
    const user = await currentUser();
    //Step 1: Check if interviewSetId exists in InterviewBeddings
    const interviewSetEmbeddings = await db
      .select({
        interviewSetId: InterviewSetEmbeddings.interviewSetId,
      })
      .from(InterviewSetEmbeddings)
      .where(eq(InterviewSetEmbeddings.interviewSetId, interviewSetId));

    if (interviewSetEmbeddings.length > 0) {
      //Step 2: Delete existing embeddings if they are exist
      await db
        .delete(InterviewSetEmbeddings)
        .where(eq(InterviewSetEmbeddings.interviewSetId, interviewSetId));
    }

    //Step 3: Select all question and answers based on interviewSetId
    const questionAnswers = await db
      .select({
        question: QuestionAnswer.question,
        answer: QuestionAnswer.answer,
      })
      .from(QuestionAnswer)
      .where(eq(QuestionAnswer.interviewSetId, interviewSetId));

    //Step 4: Concatenate the content of questions and answers
    const concatenatedContent = questionAnswers
      .map((qa) => `${qa.question} ${qa.answer}`)
      .join(" ");

    //Step 5: Generate embeddings
    const embeddings = await generateEmbeddings(concatenatedContent);

    //Step 6: Store embeddings in database
    await db.insert(InterviewSetEmbeddings).values(
      embeddings.map((embedding) => ({
        interviewSetId: interviewSetId,
        userEmail: user.primaryEmailAddress?.emailAddress,
        ...embedding,
      }))
    );
    return "Resource successfully created.";
  } catch (err) {
    console.log(err);
    return "Error, please try again.";
  }
};

export const regenerateAnswer = async (
  qaId: number,
  question: string,
  answer: string,
  interviewSetId: number
) => {
  try {
    // Fetch the interview set
    const interviewSet = await db.query.InterviewSet.findFirst({
      where: eq(InterviewSet.id, interviewSetId),
    });

    if (!interviewSet) {
      return new Response("Interview set not found", { status: 404 });
    }

    const resume = await db.query.Resume.findFirst({
      where: eq(Resume.id, interviewSet.resumeId),
    });
    if (!resume) {
      return new Response("Resume not found", { status: 404 });
    }
    const jobDescription = interviewSet.jobDescription;

    // Generate new answer
    const result = await generateText({
      model: google("gemini-1.5-pro-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are an AI Assistant who is an expert about Interview.
              Start Context: You are interviewing for a software engineering role at a top tech company based on my CV ${resume.jsonResume}, job description ${jobDescription} and ${answer} . End Context.
              Question: Generate an answer for the following question: ${question}`.replace(
                /\*/g,
                ""
              ),
            },
          ],
        },
      ],
    });
    //Update the question answer with the new answer
    await db
      .update(QuestionAnswer)
      .set({
        answer: result.text,
      })
      .where(eq(QuestionAnswer.id, qaId));

    return result.text;
  } catch (err) {
    console.log(err);
    return "Error, please try again.";
  }
};
