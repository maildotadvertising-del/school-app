import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, PrimaryButton } from "@ats/ui";
import { ChatMessages, Teachers } from "@ats/db";
import { sendDoubt } from "./actions";

export default async function ChatThreadPage({ params }: { params: Promise<{ teacherId: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { teacherId } = await params;
  const teacher = Teachers.findById(teacherId);
  if (!teacher) redirect("/chat");

  const messages = ChatMessages.forStudentTeacher(session.userId, teacherId);
  const doubtAction = sendDoubt.bind(null, teacherId);

  return (
    <Shell title={teacher.name} subtitle="Doubt chat" active="/chat">
      <div className="flex flex-col gap-2 mb-24">
        {messages.length === 0 && (
          <div className="text-sm text-[var(--ats-muted)] text-center py-8">
            No messages yet. Ask your doubt below!
          </div>
        )}
        {messages.map((m) => {
          const isStudent = m.sender === "STUDENT";
          return (
            <div key={m.id} className={`flex ${isStudent ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isStudent
                    ? "bg-gradient-to-br from-[var(--ats-purple)] to-[var(--ats-orange)] text-white"
                    : "glass-card"
                }`}
              >
                <div>{m.message}</div>
                <div className={`text-[10px] mt-1 ${isStudent ? "text-white/70" : "text-[var(--ats-muted)]"}`}>
                  {new Date(m.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4">
        <form action={doubtAction} className="glass-card flex gap-2 p-2">
          <input
            name="message"
            placeholder="Type your doubt..."
            required
            className="flex-1 bg-transparent text-sm outline-none px-2"
          />
          <PrimaryButton type="submit" className="px-4 py-2 text-sm">
            Send
          </PrimaryButton>
        </form>
      </div>
    </Shell>
  );
}
