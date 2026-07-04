import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag } from "@ats/ui";
import { HomeworkReads } from "@ats/db";

export default async function HomeworkListPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const reads = HomeworkReads.forStudent(session.userId);

  return (
    <Shell title="Home Work" subtitle="Your assignments" active="/homework">
      {reads.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No homework assigned yet.</GlassCard>
      )}
      {reads.map((r) => (
        <a key={r.id} href={`/homework/${r.homework_id}`}>
          <GlassCard className="flex items-center justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <div className="font-semibold text-[var(--ats-ink)]">{r.subject}</div>
              <div className="text-xs text-[var(--ats-muted)] truncate">{r.description}</div>
              <div className="text-xs text-[var(--ats-muted)]">
                {new Date(r.sent_at).toLocaleDateString()}
                {r.due_date && ` • Due: ${new Date(r.due_date).toLocaleDateString()}`}
              </div>
            </div>
            <Tag color={r.status === "COMPLETED" ? "orange" : "purple"}>
              {r.status === "COMPLETED" ? "Done" : r.status === "VIEWED" ? "Seen" : "New"}
            </Tag>
          </GlassCard>
        </a>
      ))}
    </Shell>
  );
}
