import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MistShell } from "@/components/MistShell";
import { useMist } from "@/lib/mist-store";
import { FACULTIES, COMMUNITY_RULES } from "@/lib/mist-social";

export const Route = createFileRoute("/rooms/")({
  head: () => ({
    meta: [
      { title: "Open rooms — cross-campus student chats | Mist" },
      {
        name: "description",
        content:
          "Open group chats for UAE students: engineering, law, computer science, business, design and health. Different universities, one room, still anonymous.",
      },
      { property: "og:title", content: "Open rooms — cross-campus student chats" },
      {
        property: "og:description",
        content: "Engineering, law, CS, business and design rooms open to students at all ten UAE campuses.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Rooms,
});

function Rooms() {
  const { rooms, toggleRoom } = useMist();
  const [faculty, setFaculty] = useState("All faculties");

  const visible = rooms.filter((r) => faculty === "All faculties" || r.faculty === faculty);

  return (
    <MistShell>
      <section className="mt-6 sm:mt-10">
        <p className="font-mono text-[11px] tracking-widest text-teal uppercase">Open rooms</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
          Everyone's already talking.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Open group chats anyone verified can walk into — no pairing, no waiting. Students from all ten campuses
          in the same room, still under aliases.
        </p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        {["All faculties", ...FACULTIES].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFaculty(f)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              faculty === f ? "bg-ink text-background" : "bg-ink/5 hover:bg-ink/10"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {visible.map((room) => (
          <article key={room.id} className="glass flex flex-col rounded-3xl p-5">
            <div className="flex items-start gap-3">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-2xl bg-butter/50 text-xl">
                {room.emoji}
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold">{room.name}</h2>
                <p className="text-sm text-muted-foreground">{room.topic}</p>
              </div>
            </div>
            <p className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
              {room.members} members · {room.messages.length} messages
            </p>
            <p className="mt-3 line-clamp-2 rounded-2xl bg-ink/5 p-3 text-sm">
              <span className="font-semibold">{room.messages.at(-1)?.author}:</span>{" "}
              {room.messages.at(-1)?.text}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <Link
                to="/rooms/$roomId"
                params={{ roomId: room.id }}
                className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Open room
              </Link>
              <button
                type="button"
                onClick={() => toggleRoom(room.id)}
                className={`rounded-full border border-line px-4 py-2.5 text-sm font-semibold transition-colors ${
                  room.joined ? "bg-mint text-ink" : "bg-card hover:bg-ink/5"
                }`}
              >
                {room.joined ? "Joined" : "Join"}
              </button>
            </div>
          </article>
        ))}
      </div>

      <section className="glass mt-8 rounded-3xl p-5 sm:p-6">
        <h2 className="text-lg font-bold">House rules in every room</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {COMMUNITY_RULES.map((rule) => (
            <li key={rule} className="rounded-2xl bg-ink/5 px-3 py-2">
              ◆ {rule}
            </li>
          ))}
        </ul>
      </section>
    </MistShell>
  );
}
