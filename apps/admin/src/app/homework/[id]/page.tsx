import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag } from "@ats/ui";
import { HomeworkRepo, Teachers, ClassRooms } from "@ats/db";

export default async function HomeworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const hw = HomeworkRepo.findById(id);
  if (!hw) notFound();

  const teacher = Teachers.findById(hw.teacher_id);
  const classRoom = ClassRooms.findById(hw.class_room_id);
  const stats = HomeworkRepo.stats(hw.id);
  const reads = HomeworkRepo.readsFor(hw.id);

  const statusLabel = { SENT: "Not Viewed", VIEWED: "Viewed", COMPLETED: "Completed" } as const;

  return (
    <Shell title={hw.subject} subtitle="Homework detail" active="/homework">
      <GlassCard>
        <Tag color="purple">{classRoom ? `${classRoom.name}-${classRoom.section}` : ""}</Tag>
        <div className="text-sm text-[var(--ats-ink)]">{hw.description}</div>
        <div className="text-xs text-[var(--ats-muted)] mt-2">
          Sent by {teacher?.name} at {new Date(hw.sent_at).toLocaleString()}
        </div>
        {hw.due_date && (
          <div className="text-xs text-[var(--ats-muted)]">Due: {new Date(hw.due_date).toLocaleDateString()}</div>
        )}
      </GlassCard>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <GlassCard className="text-center">
          <div className="text-xl font-bold text-[var(--ats-purple-dark)]">{stats.completed}</div>
          <div className="text-xs text-[var(--ats-muted)]">Completed</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-xl font-bold text-[var(--ats-orange-dark)]">{stats.viewed}</div>
          <div className="text-xs text-[var(--ats-muted)]">Viewed</div>
        </GlassCard>
        <GlassCard className="text-center">
          <div className="text-xl font-bold text-[var(--ats-muted)]">{stats.notViewed}</div>
          <div className="text-xs text-[var(--ats-muted)]">Not Viewed</div>
        </GlassCard>
      </div>

      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2">Students ({stats.total})</div>
      {reads.map((r) => (
        <GlassCard key={r.id} className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-[var(--ats-ink)]">{r.student_name}</div>
            <div className="text-xs text-[var(--ats-muted)]">
              {r.viewed_at ? `Viewed: ${new Date(r.viewed_at).toLocaleString()}` : "Not viewed yet"}
              {r.completed_at && ` • Completed: ${new Date(r.completed_at).toLocaleString()}`}
            </div>
          </div>
          <Tag color={r.status === "COMPLETED" ? "orange" : "purple"}>{statusLabel[r.status]}</Tag>
        </GlassCard>
      ))}
    </Shell>
  );
}
