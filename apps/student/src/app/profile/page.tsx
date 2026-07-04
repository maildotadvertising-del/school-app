import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard } from "@ats/ui";
import { Students, ClassRooms } from "@ats/db";
import { logout } from "@/app/logout/actions";

function ProfileRow({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-white/40 last:border-0">
      <div className="w-36 text-xs text-[var(--ats-muted)] pt-0.5 shrink-0">{label}</div>
      <div className="text-sm font-medium text-[var(--ats-ink)]">{value || "—"}</div>
    </div>
  );
}

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const student = Students.findById(session.userId);
  if (!student) redirect("/login");

  const classRoom = ClassRooms.findById(student.class_room_id);

  return (
    <Shell
      title="Profile"
      subtitle="Student information"
      active="/profile"
      right={
        <form action={logout}>
          <button className="text-xs font-semibold text-[var(--ats-muted)]">Logout</button>
        </form>
      }
    >
      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--ats-purple)] to-[var(--ats-orange)] flex items-center justify-center text-white font-bold text-2xl mb-2">
          {student.name[0]}
        </div>
        <div className="font-bold text-lg text-[var(--ats-ink)]">{student.name}</div>
        {classRoom && (
          <div className="text-sm text-[var(--ats-muted)]">
            Class {classRoom.name}-{classRoom.section}
          </div>
        )}
      </div>

      <GlassCard>
        <ProfileRow label="Student Name" value={student.name} />
        <ProfileRow label="Class" value={classRoom?.name} />
        <ProfileRow label="Section" value={classRoom?.section} />
        <ProfileRow label="Student ID" value={student.student_code} />
        <ProfileRow label="Blood Group" value={student.blood_group} />
        <ProfileRow label="Father Name" value={student.father_name} />
        <ProfileRow label="Mother Name" value={student.mother_name} />
        <ProfileRow label="Address" value={student.address} />
        <ProfileRow label="Father Phone" value={student.father_phone} />
        <ProfileRow label="Mother Phone" value={student.mother_phone} />
      </GlassCard>
    </Shell>
  );
}
