"use client";

import { useActionState } from "react";
import { startLogin, confirmLogin, type LoginState } from "./actions";

const initial: LoginState = { step: "mobile" };

export default function LoginPage() {
  const [step1, mobileAction, mobilePending] = useActionState(startLogin, initial);
  const [step2, otpAction, otpPending] = useActionState(confirmLogin, initial);
  const showOtp = step1.step === "otp";

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="glass-card w-full max-w-sm p-6">
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-[var(--ats-ink)] mb-1">ATS Connect</div>
          <div className="text-sm text-[var(--ats-muted)]">Student & Parent Login</div>
        </div>

        {!showOtp ? (
          <form action={mobileAction} className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-[var(--ats-ink)]">
              Parent Mobile Number
            </label>
            <input
              name="mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="Father / Mother phone number"
              required
              className="rounded-xl border border-white/80 bg-white/60 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--ats-purple)]"
            />
            {step1.error && <div className="text-sm text-red-600">{step1.error}</div>}
            <button disabled={mobilePending} className="btn-primary rounded-2xl px-4 py-2.5 font-semibold mt-2">
              {mobilePending ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form action={otpAction} className="flex flex-col gap-3">
            <input type="hidden" name="mobile" value={step1.mobile} />
            <label className="text-sm font-semibold text-[var(--ats-ink)]">
              OTP sent to {step1.mobile}
            </label>
            <input
              name="code"
              type="tel"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              required
              className="rounded-xl border border-white/80 bg-white/60 px-4 py-2.5 outline-none focus:ring-2 focus:ring-[var(--ats-purple)]"
            />
            {step1.devCode && (
              <div className="text-xs text-[var(--ats-muted)]">Dev mode code: {step1.devCode}</div>
            )}
            {step2.error && <div className="text-sm text-red-600">{step2.error}</div>}
            <button disabled={otpPending} className="btn-primary rounded-2xl px-4 py-2.5 font-semibold mt-2">
              {otpPending ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
