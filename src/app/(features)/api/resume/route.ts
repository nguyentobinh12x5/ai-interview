import { PDFSource, getPDFContent } from "@/lib/pdf-loader";
import { db } from "../../../../../db";
import { Resume } from "../../../../../db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET() {
  const user = await currentUser();
  const resumes = await db
    .select()
    .from(Resume)
    .where(eq(Resume.userEmail, user.primaryEmailAddress?.emailAddress));
  if (!resumes) {
    return new Response("No resumes found");
  }
  return new Response(JSON.stringify(resumes));
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) {
    return new Response("No file uploaded", { status: 400 });
  }
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfSource: PDFSource = { type: "buffer", source: buffer };
    const content = await getPDFContent(pdfSource);
    const user = await currentUser();
    const insertResult = await db
      .insert(Resume)
      .values({
        name: file.name,
        jsonResume: JSON.stringify(content),
        userEmail: user.primaryEmailAddress?.emailAddress,
      })
      .returning({ id: Resume.id });
    return new Response(
      JSON.stringify("Success updated resume with id: " + insertResult)
    );
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  console.log(id);
  if (!id) {
    return new Response("Invalpid pid", { status: 400 });
  }
  await db.delete(Resume).where(eq(Resume.id, parseInt(id)));
  return new Response("Resume deleted successfully");
}
