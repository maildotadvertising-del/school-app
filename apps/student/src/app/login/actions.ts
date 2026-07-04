"use server";

import { redirect } from "next/navigation";
import { requestOtp, verifyOtp } from "@ats/auth";
import { Students } from "@ats/db";
import { createSession } from "@/lib/session";

export type LoginState = {
  step: "mobile" | "otp";
  mobile?: string;
  error?: string;
  devCode?: string | null;
};

export async function startLogin(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const mobile = String(formData.get("mobile") || "").trim();
  if (!/^[0-9]{10}$/.test(mobile)) {
    return { step: "mobile", error: "Enter a valid 10-digit mobile number." };
  }
  // student login via parent's mobile (father or mother phone)
  const student = Students.findByPhone(mobile);
  if (!student) {
    return { step: "mobile", error: "No student found for this mobile number." };
  }
  const devCode = await requestOtp(mobile, "STUDENT");
  return { step: "otp", mobile, devCode };
}

export async function confirmLogin(prev: LoginState, formData: FormData): Promise<LoginState> {
  const mobile = String(formData.get("mobile") || prev.mobile || "");
  const code = String(formData.get("code") || "").trim();
  const ok = await verifyOtp(mobile, code, "STUDENT");
  if (!ok) return { ...prev, step: "otp", mobile, error: "Invalid or expired code." };

  const student = Students.findByPhone(mobile)!;
  await createSession({ userId: student.id, role: "STUDENT", name: student.name });
  redirect("/");
}
