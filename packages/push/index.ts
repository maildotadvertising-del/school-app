import webpush from "web-push";

export type PushSub = { endpoint: string; p256dh: string; auth: string };
export type PushPayload = { title: string; body: string; url?: string };

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const mailto = process.env.VAPID_MAILTO || "mailto:admin@atsconnect.in";
  if (!publicKey || !privateKey) return;
  webpush.setVapidDetails(mailto, publicKey, privateKey);
  configured = true;
}

export async function sendPush(sub: PushSub, payload: PushPayload): Promise<void> {
  ensureConfigured();
  if (!configured) {
    console.log("[Push stub — no VAPID keys]", payload.title);
    return;
  }
  try {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
      JSON.stringify(payload)
    );
  } catch (err: unknown) {
    // 410 Gone = subscription expired, safe to ignore
    if ((err as { statusCode?: number }).statusCode === 410) return;
    console.error("[Push error]", (err as Error).message);
  }
}

export function vapidPublicKey(): string {
  return process.env.VAPID_PUBLIC_KEY ?? "";
}
