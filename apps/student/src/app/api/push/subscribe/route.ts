import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { PushSubscriptions } from "@ats/db";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { endpoint, keys } = await req.json();
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
  }

  PushSubscriptions.upsert(session.userId, "STUDENT", endpoint, keys.p256dh, keys.auth);
  return NextResponse.json({ ok: true });
}
