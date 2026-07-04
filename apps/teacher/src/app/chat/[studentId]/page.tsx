import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Shell } from "@/components/Shell";
import { GlassCard, PrimaryButton } from "@ats/ui";
import { ChatMessages, Students } from "@ats/db";
import { sendReply } from "./actions";

export default async function ChatThreadPage({ params }: { params: Promise<{ studentId: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const { studentId } = await params;
  const student = Students.findById(studentId);
  if (!student) redirect("/chat");

  // mark student messages as read
  ChatMessages.markReadForTeacher(studentId, session.userId);

  const messages = ChatMessages.forStudentTeacher(studentId, session.userId);

  const replyAction = sendReply.bind(null, studentId);

  return (
    <Shell title={student.name} subtitle="Doubt chat" active="/chat">
      <div className="flex flex-col gap-2 mb-4">
        {messages.length === 0 && (
          <div className="text-sm text-[var(--ats-muted)] text-center py-4">No messages yet.</div>
        )}
        {messages.map((m) => {
          const isTeacher = m.sender === "TEACHER";
          return (
            <div key={m.id} className={`flex ${isTeacher ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  isTeacher
                    ? "bg-gradient-to-br from-[var(--ats-purple)] to-[var(--ats-orange)] text-white"
                    : "glass-card"
                }`}
              >
                <div>{m.message}</div>
                <div className={`text-[10px] mt-1 ${isTeacher ? "text-white/70" : "text-[var(--ats-muted)]"}`}>
                  {new Date(m.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-20 left-0 right-0 px-4">
        <form action={replyAction} className="glass-card flex gap-2 p-2">
          <input
            name="message"
            placeholder="Type reply..."
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
