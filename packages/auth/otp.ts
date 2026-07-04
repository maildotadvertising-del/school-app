import { OtpCodes } from "@ats/db";
import type { UserRole } from "@ats/db";

const OTP_TTL_MINUTES = 5;

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Dev-mode sender. Swap this with the Firebase Phone Auth client flow
// once Firebase project keys are added to .env — the rest of the
// generate/verify logic below does not need to change.
async function sendCode(mobile: string, code: string) {
  console.log(`[OTP] ${mobile} -> ${code}`);
}

export async function requestOtp(mobile: string, role: UserRole) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  OtpCodes.create(mobile, code, role, expiresAt);

  await sendCode(mobile, code);

  return process.env.NODE_ENV === "production" ? null : code;
}

export async function verifyOtp(mobile: string, code: string, role: UserRole) {
  const otp = OtpCodes.latestUnverified(mobile, code, role);

  if (!otp || new Date(otp.expires_at) < new Date()) {
    return false;
  }

  OtpCodes.markVerified(otp.id);

  return true;
}
