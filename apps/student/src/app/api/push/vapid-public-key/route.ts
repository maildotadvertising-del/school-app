import { NextResponse } from "next/server";
import { vapidPublicKey } from "@ats/push";

export async function GET() {
  return NextResponse.json({ key: vapidPublicKey() });
}
