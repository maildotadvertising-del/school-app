import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, PrimaryButton } from "@ats/ui";
import { Teachers } from "@ats/db";
import { sendHomework } from "./actions";

export default async function NewHomeworkPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const classes = Teachers.classesFor(session.userId);

  return (
    <Shell title="Send Homework" subtitle="New homework for your class" active="/homework">
      <GlassCard>
        <form action={sendHomework} className="flex flex-col gap-3">
          <select
            name="class_room_id"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2.5 text-sm outline-none"
          >
            <option value="">Select class</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}-{c.section}
              </option>
            ))}
          </select>

          <input
            name="subject"
            placeholder="Subject (e.g. Maths, Science)"
            required
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2.5 text-sm outline-none"
          />

          <textarea
            name="description"
            placeholder="Homework description..."
            required
            rows={4}
            className="rounded-xl border border-white/80 bg-white/60 px-3 py-2.5 text-sm outline-none resize-none"
          />

          <div>
            <label className="text-xs text-[var(--ats-muted)] mb-1 block">Due Date (optional)</label>
            <input
              name="due_date"
              type="date"
              className="w-full rounded-xl border border-white/80 bg-white/60 px-3 py-2.5 text-sm outline-none"
            />
          </div>

          <PrimaryButton type="submit" className="w-full mt-2">
            Send Homework
          </PrimaryButton>
        </form>
      </GlassCard>
    </Shell>
  );
}
