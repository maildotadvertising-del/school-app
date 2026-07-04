"use server";

import { revalidatePath } from "next/cache";
import { ClassRooms, Teachers, Students } from "@ats/db";

export async function createClassRoom(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const section = String(formData.get("section") || "").trim();
  if (!name || !section) return;
  ClassRooms.create(name, section);
  revalidatePath("/manage");
}

export async function createTeacher(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const mobile = String(formData.get("mobile") || "").trim();
  const classRoomId = String(formData.get("class_room_id") || "");
  if (!name || !mobile || !classRoomId) return;
  const teacher = Teachers.create(name, mobile);
  Teachers.assignClass(teacher.id, classRoomId);
  revalidatePath("/manage");
}

export async function createStudent(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const studentCode = String(formData.get("student_code") || "").trim();
  const classRoomId = String(formData.get("class_room_id") || "");
  if (!name || !studentCode || !classRoomId) return;

  Students.create({
    name,
    student_code: studentCode,
    blood_group: (formData.get("blood_group") as string) || null,
    father_name: (formData.get("father_name") as string) || null,
    mother_name: (formData.get("mother_name") as string) || null,
    address: (formData.get("address") as string) || null,
    father_phone: (formData.get("father_phone") as string) || null,
    mother_phone: (formData.get("mother_phone") as string) || null,
    class_room_id: classRoomId,
  });
  revalidatePath("/manage");
}
