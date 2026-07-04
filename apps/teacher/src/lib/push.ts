import { sendPush } from "@ats/push";
import type { PushSub, PushPayload } from "@ats/push";

export async function sendPushToUsers(sub: PushSub, payload: PushPayload) {
  await sendPush(sub, payload);
}
