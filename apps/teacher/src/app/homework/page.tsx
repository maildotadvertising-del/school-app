import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag } from "@ats/ui";
import { HomeworkRepo, Teachers } from "@ats/db";

export default async function HomeworkListPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const classes = Teachers.classesFor(session.userId);
  const homework = HomeworkRepo.listByTeacher(session.userId);

  return (
    <Shell title="Homework" subtitle="Homework you've sent" active="/homework">
      <a
        href="/homework/new"
        className="fab flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold mb-4"
      >
        + Send New Homework
      </a>

      {homework.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No homework sent yet.</GlassCard>
      )}
      {homework.map((hw) => {
        const stats = HomeworkRepo.stats(hw.id);
        const cls = classes.find((c) => c.id === hw.class_room_id);
        return (
          <a key={hw.id} href={`/homework/${hw.id}`}>
            <GlassCard>
              {cls && <Tag color="purple">{cls.name}-{cls.section}</Tag>}
              <div className="font-semibold text-[var(--ats-ink)]">{hw.subject}</div>
              <div className="text-xs text-[var(--ats-muted)]">{new Date(hw.sent_at).toLocaleString()}</div>
              <div className="flex gap-3 mt-1">
                <span className="text-xs text-[var(--ats-purple-dark)] font-semibold">{stats.completed} done</span>
                <span className="text-xs text-[var(--ats-orange-dark)] font-semibold">{stats.viewed} viewed</span>
                <span className="text-xs text-[var(--ats-muted)]">{stats.notViewed} not seen</span>
              </div>
            </GlassCard>
          </a>
        );
      })}
    </Shell>
  );
}
