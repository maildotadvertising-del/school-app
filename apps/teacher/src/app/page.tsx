import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag } from "@ats/ui";
import { Teachers, HomeworkRepo, ChatMessages } from "@ats/db";

export default async function TeacherHome() {
  const session = await getSession();
  if (!session) redirect("/login");

  const classes = Teachers.classesFor(session.userId);
  const homework = HomeworkRepo.listByTeacher(session.userId).slice(0, 5);
  const threads = ChatMessages.threadsForTeacher(session.userId);
  const unreadTotal = threads.reduce((s, t) => s + Number(t.unread), 0);

  return (
    <Shell title="My Dashboard" subtitle={session.name} active="/">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-purple-dark)]">{classes.length}</div>
          <div className="text-xs text-[var(--ats-muted)]">My Classes</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-orange-dark)]">{unreadTotal}</div>
          <div className="text-xs text-[var(--ats-muted)]">Unread Doubts</div>
        </GlassCard>
      </div>

      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2">My Classes</div>
      {classes.map((c) => (
        <GlassCard key={c.id}>
          <span className="font-semibold text-[var(--ats-ink)]">{c.name}-{c.section}</span>
        </GlassCard>
      ))}

      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2 mt-4">Recent Homework</div>
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
              <div className="text-xs text-[var(--ats-muted)]">
                {stats.completed}/{stats.total} completed • {stats.viewed} viewed
              </div>
            </GlassCard>
          </a>
        );
      })}
    </Shell>
  );
}
