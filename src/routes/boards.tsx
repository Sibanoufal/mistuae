import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MistShell } from "@/components/MistShell";
import { PostageStamp, WaxSeal } from "@/components/Postal";
import {
  BOARD_CTA,
  CAMPUS_AREA,
  UNIVERSITIES,
  UNIVERSITY_SHORT,
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
          "Post or answer anonymous invitations: ten-minute coffee chats, event partners and project collaborations across ten UAE university campuses.",
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

const KIND_META: Record<BoardKind, { label: string; icon: string; chip: string; tint: string }> = {
  coffee: { label: "Coffee chat", icon: "☕", chip: "bg-butter text-butter-foreground", tint: "bg-butter/40" },
  event: { label: "Event partner", icon: "✦", chip: "bg-mint text-ink", tint: "bg-mint/50" },
  project: { label: "Project collab", icon: "◎", chip: "bg-lilac/30 text-plum", tint: "bg-lilac/20" },
  study: { label: "Course & study", icon: "📚", chip: "bg-sky/30 text-ink", tint: "bg-sky/20" },
  society: { label: "Society event", icon: "🎟️", chip: "bg-coral/25 text-plum", tint: "bg-coral/15" },
};

const FILTERS: (BoardKind | "all")[] = ["all", "coffee", "event", "project", "study", "society"];

const AREAS = ["All areas", "Dubai International Academic City", "Dubai Knowledge Park", "Dubai Silicon Oasis", "University City, Sharjah"];

function Boards() {
  const { posts, addPost, toggleJoin, profile } = useMist();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<BoardKind | "all">("all");
  const [area, setArea] = useState(AREAS[0]!);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<BoardKind>("coffee");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [when, setWhen] = useState("");
  const [university, setUniversity] = useState<University>(profile?.university ?? UNIVERSITIES[0]);
  const [error, setError] = useState<string | null>(null);

  const visible = posts.filter(
    (p) =>
      (filter === "all" || p.kind === filter) &&
      (area === AREAS[0] || CAMPUS_AREA[p.university] === area),
  );

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
      emoji: KIND_META[kind].icon,
    });
    setTitle("");
    setBody("");
    setWhen("");
    setOpen(false);
  }

  function join(id: string, joined: boolean) {
    toggleJoin(id);
    if (!joined) navigate({ to: "/boards/$postId", params: { postId: id } });
  }

  return (
    <MistShell>
      <div className="py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-coral uppercase">The boards</p>
            <h1 className="text-4xl font-extrabold tracking-tight">Anonymous ways to say hi</h1>
            <p className="mt-2 max-w-[46ch] text-pretty text-muted-foreground">
              Drop an anonymous invite or answer someone else&apos;s — coffee, an event, or a
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
                  placeholder="Tue 2 PM · Academic City food street"
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
                      {u} — {CAMPUS_AREA[u]}
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
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                filter === f
                  ? "border-ink bg-ink text-background"
                  : "border-line bg-card text-muted-foreground"
              }`}
            >
              {f === "all" ? "Everything" : KIND_META[f].label}
            </button>
          ))}
          <label className="sr-only" htmlFor="area">
            Filter by campus area
          </label>
          <select
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <span className="ml-auto font-mono text-xs text-muted-foreground">
            {visible.length} open
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((p) => {
            const cta = BOARD_CTA[p.kind];
            return (
              <article
                key={p.id}
                className={`glass relative flex flex-col overflow-hidden rounded-3xl p-5 transition-transform hover:-translate-y-1`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -top-10 -right-10 size-28 rounded-full blur-2xl ${KIND_META[p.kind].tint}`}
                />
                <div className="relative flex items-start justify-between gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${KIND_META[p.kind].chip}`}
                  >
                    {KIND_META[p.kind].icon} {KIND_META[p.kind].label}
                  </span>
                  <PostageStamp
                    glyph={p.emoji ?? KIND_META[p.kind].icon}
                    caption={UNIVERSITY_SHORT[p.university]}
                    tint={KIND_META[p.kind].tint}
                  />
                </div>
                <Link
                  to="/boards/$postId"
                  params={{ postId: p.id }}
                  className="mt-3 text-lg leading-snug font-bold hover:underline"
                >
                  {p.title}
                </Link>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.body}</p>
                <p className="mt-3 font-mono text-[11px] tracking-widest text-teal uppercase">
                  {p.when}
                </p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {CAMPUS_AREA[p.university]}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2" aria-hidden="true">
                    {(p.interestedFrom ?? []).slice(0, 3).map((u, i) => (
                      <span
                        key={`${u}-${i}`}
                        className="grid size-7 place-items-center rounded-full border-2 border-background bg-surface font-mono text-[8px] font-semibold"
                      >
                        {UNIVERSITY_SHORT[u].slice(0, 3)}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-ink">{p.responses} interested</strong>
                    {p.spots ? ` · ${p.spots} spot${p.spots > 1 ? "s" : ""} left` : ""}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4">
                  <span className="truncate text-xs text-muted-foreground">by {p.alias}</span>
                  <button
                    onClick={() => join(p.id, p.joined)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-transform hover:-translate-y-0.5 ${
                      p.joined ? "bg-teal text-teal-foreground" : "bg-ink text-background"
                    }`}
                  >
                    {p.joined ? cta.joined : cta.idle}
                  </button>
                </div>
                {p.joined ? (
                  <WaxSeal
                    tone="teal"
                    size="sm"
                    label="✓"
                    animate
                    className="absolute bottom-4 left-4"
                  />
                ) : null}
              </article>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="glass mt-6 rounded-3xl p-10 text-center text-muted-foreground">
            Nothing on this board for that area yet — try another filter or post the first invite.
          </p>
        ) : null}
      </div>
    </MistShell>
  );
}
