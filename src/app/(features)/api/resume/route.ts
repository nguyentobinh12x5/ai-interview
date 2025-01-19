import { PDFSource, getPDFContent } from "@/lib/pdf-loader";
import { db } from "../../../../../db";
import { Resume } from "../../../../../db/schema";
import { currentUser } from "@clerk/nextjs/server";
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
    //const cleanedContent = content.replace(/[^a-zA-Z0-9\s]/g, "");
    console.log(content);
    const user = await currentUser();
    // const insertResult = await db
    //   .insert(Resume)
    //   .values({
    //     name: file.name,
    //     jsonResume: JSON.stringify(content),
    //     userEmail: user.primaryEmailAddress?.emailAddress,
    //   })
    //   .returning({ id: Resume.id });
    return new Response(JSON.stringify("Success updated resume with id: "));
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}
