"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { HomeworkReads } from "@ats/db";
import { getSession } from "@/lib/session";

export async function markCompleted(homeworkId: string) {
  const session = await getSession();
  if (!session) redirect("/login");
  HomeworkReads.markCompleted(homeworkId, session.userId);
  revalidatePath(`/homework/${homeworkId}`);
}
