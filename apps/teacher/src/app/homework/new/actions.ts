"use server";

import { redirect } from "next/navigation";
import { HomeworkRepo, Teachers, Students, PushSubscriptions } from "@ats/db";
import { getSession } from "@/lib/session";
import { sendPushToUsers } from "@/lib/push";

export async function sendHomework(formData: FormData) {
  const session = await getSession();
  if (!session) redirect("/login");

  const subject = String(formData.get("subject") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const dueDate = String(formData.get("due_date") || "").trim() || null;
  const classRoomId = String(formData.get("class_room_id") || "");

  if (!subject || !description || !classRoomId) return;

  // guard: teacher must be assigned to this class
  const isAssigned = Teachers.isAssignedToClass(session.userId, classRoomId);
  if (!isAssigned) return;

  const hw = HomeworkRepo.create({
    subject,
    description,
    dueDate,
    teacherId: session.userId,
    classRoomId,
  });

  // push notification to all students in the class
  const students = Students.listByClass(classRoomId);
  for (const student of students) {
    const subs = PushSubscriptions.listForUser(student.id);
    for (const sub of subs) {
      await sendPushToUsers(sub, {
        title: `New Homework: ${subject}`,
        body: description.slice(0, 80),
      });
    }
  }

  redirect(`/homework/${hw.id}`);
}
