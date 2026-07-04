import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag } from "@ats/ui";
import { Students, HomeworkReads, ClassRooms } from "@ats/db";
import { logout } from "@/app/logout/actions";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const student = Students.findById(session.userId);
  if (!student) redirect("/login");

  const classRoom = ClassRooms.findById(student.class_room_id);
  const reads = HomeworkReads.forStudent(session.userId);

  const pending = reads.filter((r) => r.status === "SENT").length;
  const completed = reads.filter((r) => r.status === "COMPLETED").length;
  const recent = reads.slice(0, 3);

  return (
    <Shell
      title="Dashboard"
      subtitle={`Welcome, ${student.name}`}
      active="/"
      right={
        <form action={logout}>
          <button className="text-xs font-semibold text-[var(--ats-muted)]">Logout</button>
        </form>
      }
    >
      {/* Class info */}
      {classRoom && (
        <GlassCard className="flex items-center gap-3 mb-1">
          <div>
            <div className="text-xs text-[var(--ats-muted)]">Class</div>
            <div className="font-bold text-[var(--ats-ink)]">{classRoom.name}-{classRoom.section}</div>
          </div>
          <div className="ml-4">
            <div className="text-xs text-[var(--ats-muted)]">Student ID</div>
            <div className="font-bold text-[var(--ats-ink)]">{student.student_code}</div>
          </div>
        </GlassCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 my-3">
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-orange-dark)]">{pending}</div>
          <div className="text-xs text-[var(--ats-muted)]">Pending HW</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-2xl font-bold text-[var(--ats-purple-dark)]">{completed}</div>
          <div className="text-xs text-[var(--ats-muted)]">Completed</div>
        </GlassCard>
      </div>

      {/* Recent homework */}
      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2">Recent Homework</div>
      {recent.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No homework yet.</GlassCard>
      )}
      {recent.map((r) => (
        <a key={r.id} href={`/homework/${r.homework_id}`}>
          <GlassCard className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-[var(--ats-ink)]">{r.subject}</div>
              <div className="text-xs text-[var(--ats-muted)]">{new Date(r.sent_at).toLocaleDateString()}</div>
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
