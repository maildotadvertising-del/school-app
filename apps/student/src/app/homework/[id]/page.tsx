import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, Tag, PrimaryButton } from "@ats/ui";
import { HomeworkRepo, HomeworkReads, Teachers } from "@ats/db";
import { markCompleted } from "./actions";

export default async function HomeworkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { id } = await params;
  const hw = HomeworkRepo.findById(id);
  if (!hw) notFound();

  // mark as viewed when student opens it
  HomeworkReads.markViewed(id, session.userId);

  // find the student's read record
  const reads = HomeworkReads.forStudent(session.userId);
  const myRead = reads.find((r) => r.homework_id === id);
  if (!myRead) notFound();

  const teacher = Teachers.findById(hw.teacher_id);
  const isCompleted = myRead.status === "COMPLETED";
  const completeAction = markCompleted.bind(null, id);

  return (
    <Shell title={hw.subject} subtitle="Homework detail" active="/homework">
      <GlassCard>
        <div className="flex items-start justify-between mb-2">
          <Tag color={isCompleted ? "orange" : "purple"}>
            {isCompleted ? "Completed" : myRead.status === "VIEWED" ? "Viewed" : "New"}
          </Tag>
          {hw.due_date && (
            <span className="text-xs text-[var(--ats-muted)]">Due: {new Date(hw.due_date).toLocaleDateString()}</span>
          )}
        </div>
        <div className="text-sm text-[var(--ats-ink)] leading-relaxed">{hw.description}</div>
        <div className="text-xs text-[var(--ats-muted)] mt-2">
          From: {teacher?.name} • {new Date(hw.sent_at).toLocaleString()}
        </div>
      </GlassCard>

      {!isCompleted && (
        <form action={completeAction} className="mt-2">
          <PrimaryButton type="submit" className="w-full py-3">
            Mark as Completed ✓
          </PrimaryButton>
        </form>
      )}

      {isCompleted && myRead.completed_at && (
        <GlassCard className="text-center text-sm text-[var(--ats-muted)]">
          ✓ Completed on {new Date(myRead.completed_at).toLocaleString()}
        </GlassCard>
      )}

      {/* Quick link to ask a doubt */}
      <a href={`/chat/${hw.teacher_id}`}>
        <GlassCard className="text-center text-sm font-semibold text-[var(--ats-purple-dark)] mt-2">
          Ask a Doubt to {teacher?.name}
        </GlassCard>
      </a>
    </Shell>
  );
}
