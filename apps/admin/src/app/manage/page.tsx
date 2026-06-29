import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, PrimaryButton } from "@ats/ui";
import { ClassRooms, Teachers, Students } from "@ats/db";
import { createClassRoom, createTeacher, createStudent } from "./actions";

export default async function ManagePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const classRooms = ClassRooms.list();
  const teachers = Teachers.list();

  return (
    <Shell title="Manage" subtitle="Class rooms, teachers & students" active="/manage">
      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2">Add Class Room</div>
      <GlassCard>
        <form action={createClassRoom} className="flex gap-2">
          <input
            name="name"
            placeholder="Class (e.g. 5)"
            required
            className="flex-1 rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="section"
            placeholder="Section (e.g. A)"
            required
            className="w-24 rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <PrimaryButton type="submit">Add</PrimaryButton>
        </form>
      </GlassCard>
      {classRooms.map((c) => (
        <div key={c.id} className="text-xs text-[var(--ats-muted)] mb-1 px-2">
          {c.name}-{c.section}
        </div>
      ))}

      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2 mt-5">Add Teacher</div>
      <GlassCard>
        <form action={createTeacher} className="flex flex-col gap-2">
          <input
            name="name"
            placeholder="Teacher name"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="mobile"
            placeholder="Mobile number"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <select
            name="class_room_id"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          >
            <option value="">Assign class room</option>
            {classRooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}-{c.section}
              </option>
            ))}
          </select>
          <PrimaryButton type="submit">Add Teacher</PrimaryButton>
        </form>
      </GlassCard>
      {teachers.map((t) => (
        <div key={t.id} className="text-xs text-[var(--ats-muted)] mb-1 px-2">
          {t.name} • {t.mobile}
        </div>
      ))}

      <div className="text-sm font-bold text-[var(--ats-ink)] mb-2 mt-5">Add Student</div>
      <GlassCard>
        <form action={createStudent} className="flex flex-col gap-2">
          <input
            name="name"
            placeholder="Student name"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="student_code"
            placeholder="Student ID number"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <select
            name="class_room_id"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          >
            <option value="">Class room</option>
            {classRooms.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}-{c.section}
              </option>
            ))}
          </select>
          <input
            name="blood_group"
            placeholder="Blood group"
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="father_name"
            placeholder="Father name"
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="mother_name"
            placeholder="Mother name"
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="address"
            placeholder="Address"
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="father_phone"
            placeholder="Father phone number"
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <input
            name="mother_phone"
            placeholder="Mother phone number"
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2 text-sm outline-none"
          />
          <PrimaryButton type="submit">Add Student</PrimaryButton>
        </form>
      </GlassCard>
    </Shell>
  );
}
