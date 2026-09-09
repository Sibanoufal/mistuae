import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MistShell } from "@/components/MistShell";
import {
  UNIVERSITIES,
  useMist,
  type BoardKind,
  type University,
} from "@/lib/mist-store";

export const Route = createFileRoute("/boards")({
  head: () => ({
    meta: [
      { title: "Coffee chats, event partners & project collabs — Mist" },
      {
        name: "description",
        content:
          "Post or answer anonymous invitations: ten-minute coffee chats, event partners and project collaborations across UAE universities.",
      },
      { property: "og:title", content: "Coffee chats, event partners & project collabs — Mist" },
      {
        property: "og:description",
        content: "Anonymous invitations from verified students at ten UAE universities.",
      },
    ],
  }),
  component: Boards,
});

const KIND_META: Record<BoardKind, { label: string; icon: string; chip: string }> = {
  coffee: { label: "Coffee chat", icon: "☕", chip: "bg-coral/15 text-ink" },
  event: { label: "Event partner", icon: "✦", chip: "bg-teal/15 text-teal" },
  project: { label: "Project collab", icon: "◎", chip: "bg-aqua/25 text-ink" },
};

const FILTERS: (BoardKind | "all")[] = ["all", "coffee", "event", "project"];

function Boards() {
  const { posts, addPost, toggleJoin, profile } = useMist();
  const [filter, setFilter] = useState<BoardKind | "all">("all");
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<BoardKind>("coffee");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [when, setWhen] = useState("");
  const [university, setUniversity] = useState<University>(profile?.university ?? UNIVERSITIES[0]);
  const [error, setError] = useState<string | null>(null);

  const visible = filter === "all" ? posts : posts.filter((p) => p.kind === filter);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 6) {
      setError("Give your invite a title of at least 6 characters.");
      return;
    }
    if (body.trim().length < 10) {
      setError("Add a couple of lines so people know what they're joining.");
      return;
    }
    setError(null);
    addPost({
      kind,
      title: title.trim().slice(0, 90),
      body: body.trim().slice(0, 240),
      when: when.trim().slice(0, 60) || "Flexible",
      university,
      alias: profile?.alias ?? "Anonymous student",
    });
    setTitle("");
    setBody("");
    setWhen("");
    setOpen(false);
  }

  return (
    <MistShell>
      <div className="py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-coral uppercase">The boards</p>
            <h1 className="text-4xl font-extrabold tracking-tight">Anonymous ways to say hi</h1>
            <p className="mt-2 max-w-[46ch] text-pretty text-muted-foreground">
              Drop an anonymous invite or volunteer for someone else&apos;s — coffee, an event, or a
              project. Names stay hidden until you both want otherwise.
            </p>
          </div>
          <button
            onClick={() => setOpen((o) => !o)}
            className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-coral-foreground transition-transform hover:-translate-y-0.5"
          >
            {open ? "Close form" : "Post an anonymous invite"}
          </button>
        </div>

        {open ? (
          <form onSubmit={submit} className="glass mt-6 animate-pop rounded-[28px] p-5 sm:p-6">
            <fieldset>
              <legend className="text-sm font-semibold">What kind of invite?</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(KIND_META) as BoardKind[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={kind === k}
                    onClick={() => setKind(k)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${
                      kind === k
                        ? "border-teal bg-teal text-teal-foreground"
                        : "border-line bg-card text-muted-foreground"
                    }`}
                  >
                    {KIND_META[k].icon} {KIND_META[k].label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold">
                  Title
                </label>
                <input
                  id="title"
                  value={title}
                  maxLength={90}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Looking for someone to study statistics with"
                  className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="body" className="block text-sm font-semibold">
                  Details
                </label>
                <textarea
                  id="body"
                  value={body}
                  maxLength={240}
                  rows={3}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Where, what vibe, and what you're hoping for."
                  className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="when" className="block text-sm font-semibold">
                  When / where
                </label>
                <input
                  id="when"
                  value={when}
                  maxLength={60}
                  onChange={(e) => setWhen(e.target.value)}
                  placeholder="Tue 2 PM · Academic City"
                  className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label htmlFor="board-uni" className="block text-sm font-semibold">
                  Campus
                </label>
                <select
                  id="board-uni"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value as University)}
                  className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <p role="alert" className="mt-4 rounded-2xl bg-coral/15 px-4 py-3 text-sm">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              className="mt-5 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background"
            >
              Post anonymously as {profile?.alias ?? "a masked student"}
            </button>
          </form>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter invites">
          {FILTERS.map((f) => (
            <button
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                filter === f
                  ? "border-ink bg-ink text-background"
                  : "border-line bg-card text-muted-foreground"
              }`}
            >
              {f === "all" ? "Everything" : KIND_META[f].label}
            </button>
          ))}
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {visible.length} open
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => (
            <article
              key={p.id}
              className="glass flex flex-col rounded-3xl p-5 transition-transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${KIND_META[p.kind].chip}`}
                >
                  {KIND_META[p.kind].icon} {KIND_META[p.kind].label}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{p.university}</span>
              </div>
              <h2 className="mt-4 text-lg leading-snug font-bold">{p.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              <p className="mt-3 font-mono text-[11px] tracking-widest text-teal uppercase">
                {p.when}
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                <span className="text-xs text-muted-foreground">
                  {p.alias} · {p.responses} interested
                </span>
                <button
                  onClick={() => toggleJoin(p.id)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5 ${
                    p.joined
                      ? "bg-teal text-teal-foreground"
                      : "bg-ink text-background"
                  }`}
                >
                  {p.joined
                    ? "You're in — tap to withdraw"
                    : p.kind === "coffee"
                      ? "Grab a seat"
                      : p.kind === "event"
                        ? "Volunteer"
                        : "Join crew"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MistShell>
  );
}
