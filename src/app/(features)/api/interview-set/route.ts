import { db } from "../../../../../db";
import { QuestionAnswer } from "../../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const questions = await db
    .select()
    .from(QuestionAnswer)
    .where(eq(QuestionAnswer.interviewSetId, parseInt(id)));
  if (!questions) {
    return new Response("No questions found");
  }
  return new Response(JSON.stringify(questions));
}
