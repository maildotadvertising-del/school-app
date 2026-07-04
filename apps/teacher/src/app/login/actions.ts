"use server";

import { redirect } from "next/navigation";
import { requestOtp, verifyOtp } from "@ats/auth";
import { Teachers } from "@ats/db";
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
  const teacher = Teachers.findByMobile(mobile);
  if (!teacher) {
    return { step: "mobile", error: "This mobile number is not registered as a Teacher." };
  }
  const devCode = await requestOtp(mobile, "TEACHER");
  return { step: "otp", mobile, devCode };
}

export async function confirmLogin(prev: LoginState, formData: FormData): Promise<LoginState> {
  const mobile = String(formData.get("mobile") || prev.mobile || "");
  const code = String(formData.get("code") || "").trim();
  const ok = await verifyOtp(mobile, code, "TEACHER");
  if (!ok) return { ...prev, step: "otp", mobile, error: "Invalid or expired code." };

  const teacher = Teachers.findByMobile(mobile)!;
  await createSession({ userId: teacher.id, role: "TEACHER", name: teacher.name });
  redirect("/");
}
