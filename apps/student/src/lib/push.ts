// Web Push sender stub — wired fully in Task #7 (push notification setup).

type PushSub = { endpoint: string; p256dh: string; auth: string };
type PushPayload = { title: string; body: string };

export async function sendPushToUsers(sub: PushSub, payload: PushPayload) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
    console.log("[Push stub]", payload.title, "->", sub.endpoint.slice(0, 40));
    return;
  }
  // real send implemented in Task #7
}
