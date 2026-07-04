"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ChatMessages, PushSubscriptions, Students } from "@ats/db";
import { getSession } from "@/lib/session";
import { sendPushToUsers } from "@/lib/push";

export async function sendReply(studentId: string, formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const message = String(formData.get("message") || "").trim();
  if (!message) return;

  ChatMessages.create(session.userId, studentId, "TEACHER", message);

  // push notification to student
  const student = Students.findById(studentId);
  if (student) {
    const subs = PushSubscriptions.listForUser(student.id);
    for (const sub of subs) {
      await sendPushToUsers(sub, {
        title: `Reply from ${session.name}`,
        body: message.slice(0, 80),
      });
    }
  }

  revalidatePath(`/chat/${studentId}`);
}
