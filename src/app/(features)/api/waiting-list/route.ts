import { db } from "../../../../../db";
import { WaitingList } from "../../../../../db/schema";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const phoneNumber = formData.get("phoneNumber") as string;
  const fullName = formData.get("fullName") as string;
  const jobTitle = formData.get("jobTitle") as string;
  try {
    await db
      .insert(WaitingList)
      .values({
        email,
        phoneNumber,
        fullName,
        jobTitle,
      })
      .returning();

    return new Response("Successed join waiting list!", { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response("Error processing request", { status: 500 });
  }
}
