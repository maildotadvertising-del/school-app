"use server";

import { redirect } from "next/navigation";
import { requestOtp, verifyOtp } from "@ats/auth";
import { Admins } from "@ats/db";
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

  const admin = Admins.findByMobile(mobile);
  if (!admin) {
    return { step: "mobile", error: "This mobile number is not registered as an Admin." };
  }

  const devCode = await requestOtp(mobile, "ADMIN");
  return { step: "otp", mobile, devCode };
}

export async function confirmLogin(prev: LoginState, formData: FormData): Promise<LoginState> {
  const mobile = String(formData.get("mobile") || prev.mobile || "");
  const code = String(formData.get("code") || "").trim();

  const ok = await verifyOtp(mobile, code, "ADMIN");
  if (!ok) {
    return { ...prev, step: "otp", mobile, error: "Invalid or expired code." };
  }

  const admin = Admins.findByMobile(mobile);
  if (!admin) {
    return { step: "mobile", error: "This mobile number is not registered as an Admin." };
  }

  await createSession({ userId: admin.id, role: "ADMIN", name: admin.name });
  redirect("/");
}
