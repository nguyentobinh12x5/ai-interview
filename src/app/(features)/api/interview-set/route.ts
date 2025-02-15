import { db } from "../../../../../db";
import { QuestionAnswer } from "../../../../../db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const questions = await db
    .select()
    .from(QuestionAnswer)
    .where(eq(QuestionAnswer.interviewSetId, parseInt(id)))
    .orderBy(sql`${QuestionAnswer.createdAt} asc`);
  if (!questions) {
    return new Response("No questions found");
  }
  return new Response(JSON.stringify(questions));
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const answer = formData.get("answer") as string;
  const question = formData.get("question") as string;
  const interviewSetId = formData.get("interviewSetId") as string;
  try {
    const newQuestionAnswer = await db
      .insert(QuestionAnswer)
      .values({
        question,
        answer,
        interviewSetId: parseInt(interviewSetId),
      })
      .returning();

    return new Response(JSON.stringify(newQuestionAnswer), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}

export async function PUT(req: Request) {
  const formData = await req.formData();
  const qaId = formData.get("qaId");
  const answer = formData.get("answer");
  try {
    await db
      .update(QuestionAnswer)
      .set({ answer: answer as string })
      .where(eq(QuestionAnswer.id, parseInt(qaId as string)));

    return new Response(JSON.stringify("Successfully updated answer"));
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const qaId = url.searchParams.get("qaId");
  try {
    await db
      .delete(QuestionAnswer)
      .where(eq(QuestionAnswer.id, parseInt(qaId as string)));

    return new Response(JSON.stringify("Successfully deleted question"));
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}
