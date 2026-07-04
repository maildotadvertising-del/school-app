import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { GlassCard } from "@ats/ui";
import { Teachers, Students, ClassRooms, HomeworkRepo } from "@ats/db";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const teachers = Teachers.list();
  const classRooms = ClassRooms.list();
  const homework = HomeworkRepo.listAll();
  const totalStudents = classRooms.reduce((sum, c) => sum + Students.listByClass(c.id).length, 0);

  const recentHomework = homework.slice(0, 5);

  return (
    <Shell title="Admin Dashboard" subtitle={`Welcome, ${session.name}`} active="/">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-purple-dark)]">{teachers.length}</div>
          <div className="text-xs text-[var(--ats-muted)]">Teachers</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-orange-dark)]">{totalStudents}</div>
          <div className="text-xs text-[var(--ats-muted)]">Students</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-purple-dark)]">{classRooms.length}</div>
          <div className="text-xs text-[var(--ats-muted)]">Class Rooms</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-orange-dark)]">{homework.length}</div>
          <div className="text-xs text-[var(--ats-muted)]">Homework Sent</div>
        </GlassCard>
      </div>

      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2">Recent Homework</div>
      {recentHomework.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No homework sent yet.</GlassCard>
      )}
      {recentHomework.map((hw) => {
        const stats = HomeworkRepo.stats(hw.id);
        const teacher = teachers.find((t) => t.id === hw.teacher_id);
        const classRoom = classRooms.find((c) => c.id === hw.class_room_id);
        return (
          <a key={hw.id} href={`/homework/${hw.id}`}>
            <GlassCard>
              <div className="font-semibold text-[var(--ats-ink)]">{hw.subject}</div>
              <div className="text-xs text-[var(--ats-muted)]">
                {teacher?.name} • {classRoom?.name}-{classRoom?.section} • {new Date(hw.sent_at).toLocaleString()}
              </div>
              <div className="text-xs mt-1 text-[var(--ats-muted)]">
                {stats.completed}/{stats.total} completed • {stats.viewed} viewed • {stats.notViewed} not viewed
              </div>
            </GlassCard>
          </a>
        );
      })}
    </Shell>
  );
}
