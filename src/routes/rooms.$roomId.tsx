import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MistShell } from "@/components/MistShell";
import { useMist } from "@/lib/mist-store";
import { REPORT_REASONS } from "@/lib/mist-social";

export const Route = createFileRoute("/rooms/$roomId")({
  head: () => ({
    meta: [
      { title: "Room — cross-campus chat | Mist" },
      {
        name: "description",
        content:
          "An open, anonymous group chat for verified UAE students across ten campuses, with reporting and blocking built in.",
      },
      { property: "og:title", content: "Room — cross-campus chat | Mist" },
      {
        property: "og:description",
        content: "Open anonymous group chat for verified UAE students, moderated from day one.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoomView,
});

function RoomView() {
  const { roomId } = useParams({ from: "/rooms/$roomId" });
  const { rooms, sendRoomMessage, toggleRoom, blocked, blockAlias, reportAlias, profile } = useMist();
  const room = rooms.find((r) => r.id === roomId);
  const [text, setText] = useState("");
  const [reporting, setReporting] = useState<string | null>(null);
  const [reason, setReason] = useState(REPORT_REASONS[0]!);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [room?.messages.length]);

  if (!room) {
    return (
      <MistShell>
        <section className="glass mt-8 rounded-3xl p-8 text-center">
          <h1 className="text-2xl font-bold">That room has closed.</h1>
          <Link to="/rooms" className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 font-semibold text-background">
            Back to rooms
          </Link>
        </section>
      </MistShell>
    );
  }

  const visible = room.messages.filter((m) => !blocked.includes(m.author));

  return (
    <MistShell>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <Link to="/rooms" className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            ← All rooms
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
            <span aria-hidden="true">{room.emoji}</span> {room.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            {room.topic} · {room.members} members
          </p>
        </div>
        <button
          type="button"
          onClick={() => toggleRoom(room.id)}
          className={`rounded-full border border-line px-4 py-2.5 text-sm font-semibold ${
            room.joined ? "bg-mint text-ink" : "bg-card hover:bg-ink/5"
          }`}
        >
          {room.joined ? "Joined" : "Join room"}
        </button>
      </div>

      <section className="glass mt-5 rounded-3xl p-4 sm:p-5">
        <ul className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
          {visible.map((m) => {
            const mine = m.author === "me";
            return (
              <li key={m.id} className={mine ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[70%] ${
                    mine ? "bg-ink text-background" : "bg-card border border-line"
                  }`}
                >
                  {!mine ? (
                    <p className="mb-1 flex items-center gap-2 font-mono text-[10px] tracking-wide uppercase">
                      <span>{m.author}</span>
                      <span className="rounded-full bg-mint px-1.5 py-0.5 text-[9px] text-ink">✓ verified</span>
                      <button
                        type="button"
                        onClick={() => setReporting(m.author)}
                        className="text-coral underline-offset-2 hover:underline"
                      >
                        report
                      </button>
                      <button
                        type="button"
                        onClick={() => blockAlias(m.author)}
                        className="text-muted-foreground underline-offset-2 hover:underline"
                      >
                        block
                      </button>
                    </p>
                  ) : (
                    <p className="mb-1 font-mono text-[10px] tracking-wide uppercase opacity-70">
                      {profile?.alias ?? "You"}
                    </p>
                  )}
                  {m.text}
                </div>
              </li>
            );
          })}
          <div ref={endRef} />
        </ul>

        <form
          className="mt-4 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            sendRoomMessage(room.id, text);
            setText("");
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder={`Say something to ${room.members} students…`}
            className="flex-1 rounded-2xl border border-line bg-card px-4 py-3 text-sm"
            aria-label="Message the room"
          />
          <button
            type="submit"
            className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
          >
            Send
          </button>
        </form>
        <p className="mt-2 font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          Rooms are moderated · romantic or sexual solicitation is removed and the account loses verification
        </p>
      </section>

      {reporting ? (
        <ReportDialog
          alias={reporting}
          onClose={() => setReporting(null)}
          onReport={(reason, note) => {
            reportAlias(reporting, reason, note);
            setSent(reporting);
            setReporting(null);
          }}
          onBlock={() => {
            blockAlias(reporting);
            reportAlias(reporting, "Blocked from room", "");
            setSent(reporting);
            setReporting(null);
          }}
        />
      ) : null}


      {sent ? (
        <p className="mt-4 rounded-2xl bg-mint px-4 py-3 text-sm text-ink">
          Report about {sent} sent to moderators. You'll get a decision within 24 hours.
        </p>
      ) : null}
    </MistShell>
  );
}
