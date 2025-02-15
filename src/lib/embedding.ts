import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";
import { db } from "../../db";
import { InterviewSetEmbeddings } from "../../db/schema";

const embeddingModel = google.textEmbeddingModel("text-embedding-004", {
  outputDimensionality: 768,
});
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (
  userQuery: string,
  userEmail: string
) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    InterviewSetEmbeddings.embedding,
    userQueryEmbedded
  )})`;
  const similarGuides = await db
    .select({ name: InterviewSetEmbeddings.content, similarity })
    .from(InterviewSetEmbeddings)
    .where(
      gt(similarity, 0.5) && eq(InterviewSetEmbeddings.userEmail, userEmail)
    )
    .orderBy((t) => desc(t.similarity))
    .limit(3);
  return similarGuides;
};
