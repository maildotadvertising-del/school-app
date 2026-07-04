import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard } from "@ats/ui";
import { ChatMessages } from "@ats/db";

export default async function ChatInboxPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const threads = ChatMessages.threadsForTeacher(session.userId);

  return (
    <Shell title="Doubts" subtitle="Student messages" active="/chat">
      {threads.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No student messages yet.</GlassCard>
      )}
      {threads.map((t) => (
        <a key={t.student_id} href={`/chat/${t.student_id}`}>
          <GlassCard className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[var(--ats-ink)]">{t.student_name}</div>
              <div className="text-xs text-[var(--ats-muted)]">{new Date(t.last_at).toLocaleString()}</div>
            </div>
            {Number(t.unread) > 0 && (
              <span className="tag-purple inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold">
                {t.unread}
              </span>
            )}
          </GlassCard>
        </a>
      ))}
    </Shell>
  );
}
