import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard } from "@ats/ui";
import { Students, Teachers } from "@ats/db";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const student = Students.findById(session.userId);
  if (!student) redirect("/login");

  // list teachers assigned to this student's class
  const allTeachers = Teachers.list();
  const classTeachers = allTeachers.filter((t) =>
    Teachers.isAssignedToClass(t.id, student.class_room_id)
  );

  return (
    <Shell title="Chat" subtitle="Ask your teachers" active="/chat">
      {classTeachers.length === 0 && (
        <GlassCard className="text-sm text-[var(--ats-muted)]">No teachers assigned yet.</GlassCard>
      )}
      {classTeachers.map((t) => (
        <a key={t.id} href={`/chat/${t.id}`}>
          <GlassCard className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--ats-purple)] to-[var(--ats-orange)] flex items-center justify-center text-white font-bold text-sm">
              {t.name[0]}
            </div>
            <div>
              <div className="font-semibold text-[var(--ats-ink)]">{t.name}</div>
              <div className="text-xs text-[var(--ats-muted)]">Tap to chat</div>
            </div>
          </GlassCard>
        </a>
      ))}
    </Shell>
  );
}
