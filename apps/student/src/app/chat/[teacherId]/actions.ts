"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ChatMessages, PushSubscriptions, Teachers } from "@ats/db";
import { getSession } from "@/lib/session";
import { sendPushToUsers } from "@/lib/push";

export async function sendDoubt(teacherId: string, formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const message = String(formData.get("message") || "").trim();
  if (!message) return;

  ChatMessages.create(teacherId, session.userId, "STUDENT", message);

  // push notification to teacher
  const teacher = Teachers.findById(teacherId);
  if (teacher) {
    const subs = PushSubscriptions.listForUser(teacher.id);
    for (const sub of subs) {
      await sendPushToUsers(sub, {
        title: `Doubt from ${session.name}`,
        body: message.slice(0, 80),
      });
    }
  }

  revalidatePath(`/chat/${teacherId}`);
}
