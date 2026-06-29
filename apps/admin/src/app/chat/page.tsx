import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag } from "@ats/ui";
import { ChatMessages } from "@ats/db";

export default async function AdminChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const messages = ChatMessages.allForAdmin();

  return (
    <Shell title="Chat Oversight" subtitle="Student ↔ Teacher conversations" active="/chat">
      {messages.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No chat messages yet.</GlassCard>
      )}
      {messages.map((m) => (
        <GlassCard key={m.id}>
          <Tag color={m.sender === "TEACHER" ? "purple" : "orange"}>
            {m.sender === "TEACHER" ? m.teacher_name : m.student_name}
          </Tag>
          <div className="text-sm text-[var(--ats-ink)]">{m.message}</div>
          <div className="text-xs text-[var(--ats-muted)] mt-1">
            {m.teacher_name} ↔ {m.student_name} • {new Date(m.created_at).toLocaleString()}
          </div>
        </GlassCard>
      ))}
    </Shell>
  );
}
