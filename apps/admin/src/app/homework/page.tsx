import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag } from "@ats/ui";
import { HomeworkRepo, Teachers, ClassRooms } from "@ats/db";

export default async function HomeworkListPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const homework = HomeworkRepo.listAll();
  const teachers = Teachers.list();
  const classRooms = ClassRooms.list();

  return (
    <Shell title="Homework Monitor" subtitle="All homework sent by teachers" active="/homework">
      {homework.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No homework sent yet.</GlassCard>
      )}
      {homework.map((hw) => {
        const stats = HomeworkRepo.stats(hw.id);
        const teacher = teachers.find((t) => t.id === hw.teacher_id);
        const classRoom = classRooms.find((c) => c.id === hw.class_room_id);
        return (
          <a key={hw.id} href={`/homework/${hw.id}`}>
            <GlassCard>
              <Tag color="purple">{classRoom ? `${classRoom.name}-${classRoom.section}` : ""}</Tag>
              <div className="font-semibold text-[var(--ats-ink)]">{hw.subject}</div>
              <div className="text-xs text-[var(--ats-muted)]">
                Sent by {teacher?.name} at {new Date(hw.sent_at).toLocaleString()}
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
