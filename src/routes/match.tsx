import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { MistShell } from "@/components/MistShell";
import { Postmark, WaxSeal } from "@/components/Postal";
import {
  CAMPUS_AREA,
  CAMPUS_CLUSTERS,
  DURATION_LABEL,
  INTERESTS,
  UNIVERSITIES,
  UNIVERSITY_SHORT,
  randomAlias,
  travelNote,
  useMist,
  type ChatDuration,
  type ChatMode,
  type University,
} from "@/lib/mist-store";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Swipe the anonymous deck — Mist" },
      {
        name: "description",
        content:
          "Drag through masked students from ten UAE campuses, filter the pool live by area, and open a one-to-one or small-crew anonymous thread.",
      },
      { property: "og:title", content: "Swipe the anonymous deck — Mist" },
      {
        property: "og:description",
        content: "A draggable deck of masked students. Filter by campus area and set your clock.",
      },
    ],
  }),
  component: Match,
});

const DURATIONS: ChatDuration[] = ["minutes", "day", "forever"];
const AREAS = CAMPUS_CLUSTERS.map((c) => c.area);

const LINES = [
  "I have opinions about the campus canteen and nobody to share them with.",
  "Looking for someone to be quietly weird at, over text.",
  "I will absolutely reply within 24 hours. Probably at 1am.",
  "Transferred this term. Currently friends with the library staff only.",
  "I want a pen pal who sends actual paragraphs, not 'hey'.",
  "Commute is 45 minutes each way. Entertain me, stranger.",
  "Never been to another campus. Curious what yours is like.",
  "Fluent in three languages, awkward in all of them.",
];

const YEARS = ["Year 1", "Year 2", "Year 3", "Year 4", "Postgraduate"];

type Candidate = {
  id: string;
  alias: string;
  university: University;
  year: string;
  interest: string;
  line: string;
};

function pick<T>(a: readonly T[]) {
  return a[Math.floor(Math.random() * a.length)]!;
}

function makeCandidates(n: number): Candidate[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `c${i}-${Math.random().toString(36).slice(2, 7)}`,
    alias: randomAlias(),
    university: pick(UNIVERSITIES),
    year: pick(YEARS),
    interest: pick(INTERESTS),
    line: pick(LINES),
  }));
}

function Match() {
  const navigate = useNavigate();
  const { profile, createThread, threads, ready } = useMist();
  const [mode, setMode] = useState<ChatMode>("pair");
  const [duration, setDuration] = useState<ChatDuration>("minutes");
  const [areas, setAreas] = useState<string[]>(AREAS);
  const [deck, setDeck] = useState<Candidate[]>([]);
  const [passed, setPassed] = useState(0);
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [matched, setMatched] = useState<Candidate | null>(null);
  const [expanded, setExpanded] = useState<Candidate | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setDeck(makeCandidates(24));
  }, []);

  const pool = useMemo(
    () => deck.filter((c) => areas.includes(CAMPUS_AREA[c.university])),
    [deck, areas],
  );
  const top = pool[0] ?? null;
  const next = pool[1] ?? null;

  function toggleArea(a: string) {
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));
  }

  function resolve(dir: "like" | "pass") {
    if (!top) return;
    setDrag({ x: 0, y: 0, active: false });
    setDeck((d) => d.filter((c) => c.id !== top.id));
    if (dir === "pass") {
      setPassed((p) => p + 1);
      return;
    }
    setMatched(top);
  }

  function confirmMatch() {
    if (!matched) return;
    const t = createThread({
      mode,
      duration,
      sharedInterest: matched.interest,
      partner: { alias: matched.alias, university: matched.university },
    });
    setMatched(null);
    navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
  }

  function onDown(e: React.PointerEvent) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY };
    setDrag({ x: 0, y: 0, active: true });
  }
  function onMove(e: React.PointerEvent) {
    if (!start.current) return;
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true });
  }
  function onUp() {
    if (!start.current) return;
    start.current = null;
    const moved = Math.abs(drag.x) + Math.abs(drag.y);
    if (drag.x > 110) resolve("like");
    else if (drag.x < -110) resolve("pass");
    else {
      setDrag({ x: 0, y: 0, active: false });
      if (moved < 8 && top) setExpanded(top);
    }
  }

  if (ready && !profile) {
    return (
      <MistShell>
        <div className="glass mx-auto my-16 max-w-md rounded-[32px] p-8 text-center">
          <h1 className="text-2xl font-extrabold">Verify first</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mist is students-only, so we need your university email verified before matching you.
          </p>
          <Link
            to="/join"
            className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background"
          >
            Verify my student email
          </Link>
        </div>
      </MistShell>
    );
  }

  const tilt = drag.x / 18;
  const likeOpacity = Math.min(1, Math.max(0, drag.x / 110));
  const passOpacity = Math.min(1, Math.max(0, -drag.x / 110));

  return (
    <MistShell>
      <div className="py-8">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase">The deck</p>
        <h1 className="mt-2 max-w-[20ch] text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
          Drag left to pass. Drag right to write.
        </h1>
        <p className="mt-3 max-w-[52ch] text-pretty text-muted-foreground">
          Masked students from ten campuses, no photos, no names. Narrow the pool by area and it
          changes under your hands.
        </p>

        {/* Live campus filter */}
        <section aria-label="Campus filter" className="glass mt-6 rounded-[28px] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Pool: which areas?</h2>
            <p className="font-mono text-xs text-muted-foreground">
              <span className="text-2xl font-bold text-teal tabular-nums">{pool.length}</span> of{" "}
              {deck.length} masks in range
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CAMPUS_CLUSTERS.map((cl) => {
              const on = areas.includes(cl.area);
              const count = deck.filter((c) => CAMPUS_AREA[c.university] === cl.area).length;
              return (
                <button
                  key={cl.area}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleArea(cl.area)}
                  className={`rounded-2xl border px-4 py-2 text-left text-sm transition-transform hover:-translate-y-0.5 ${
                    on ? "border-teal bg-teal/10" : "border-line bg-card opacity-60"
                  }`}
                >
                  <span className="block font-semibold">{cl.area}</span>
                  <span className="block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {cl.members.map((m) => UNIVERSITY_SHORT[m]).join(" · ")} — {count} here
                  </span>
                </button>
              );
            })}
          </div>
          <div
            aria-hidden="true"
            className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal via-lilac to-coral transition-all duration-500"
              style={{ width: `${deck.length ? (pool.length / deck.length) * 100 : 0}%` }}
            />
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          {/* Deck */}
          <section aria-label="Swipe deck" className="lg:col-span-7">
            <div className="relative mx-auto h-[470px] w-full max-w-[420px] select-none sm:h-[480px]">
              {next ? (
                <div className="absolute inset-x-4 top-4 h-[86%] rotate-2 rounded-[28px] border border-paper-line bg-gradient-to-br from-lilac/25 to-paper" />
              ) : null}
              {top ? (
                <article
                  onPointerDown={onDown}
                  onPointerMove={onMove}
                  onPointerUp={onUp}
                  onPointerCancel={onUp}
                  style={{
                    transform: `translate(${drag.x}px, ${drag.y * 0.25}px) rotate(${tilt}deg)`,
                    transition: drag.active ? "none" : "transform 320ms cubic-bezier(0.32,0.72,0,1)",
                    touchAction: "none",
                  }}
                  className="paper absolute inset-0 flex cursor-grab flex-col overflow-hidden rounded-[28px] p-5 sm:p-6 shadow-[0_30px_50px_-30px_oklch(0.262_0.038_210/0.6)] active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        Masked student
                      </p>
                      <h3 className="mt-1 font-serif text-3xl">{top.alias}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {UNIVERSITY_SHORT[top.university]} · {top.year}
                      </p>
                    </div>
                    <WaxSeal tone="lilac" label={top.alias[0]} />
                  </div>

                  <p className="mt-4 font-serif text-xl leading-snug text-pretty sm:text-2xl">
                    “{top.line}”
                  </p>

                  <button
                    type="button"
                    onClick={() => setExpanded(top)}
                    className="mt-2 self-start text-xs font-semibold text-plum underline underline-offset-4"
                  >
                    Read the full card →
                  </button>

                  <dl className="mt-auto space-y-2 pt-4 text-sm">
                    <div className="flex justify-between rounded-2xl bg-background/70 px-3 py-2">
                      <dt className="text-muted-foreground">Shared interest</dt>
                      <dd className="font-semibold">{top.interest}</dd>
                    </div>
                    <div className="flex justify-between gap-3 rounded-2xl bg-background/70 px-3 py-2">
                      <dt className="text-muted-foreground">Distance</dt>
                      <dd className="text-right text-xs font-semibold">
                        {profile ? travelNote(profile.university, top.university) : CAMPUS_AREA[top.university]}
                      </dd>
                    </div>
                  </dl>

                  <span
                    style={{ opacity: likeOpacity }}
                    className="absolute top-6 left-6 -rotate-12 rounded-lg border-4 border-teal px-3 py-1 font-mono text-lg tracking-widest text-teal uppercase"
                  >
                    Write
                  </span>
                  <span
                    style={{ opacity: passOpacity }}
                    className="absolute top-6 right-6 rotate-12 rounded-lg border-4 border-coral px-3 py-1 font-mono text-lg tracking-widest text-coral uppercase"
                  >
                    Pass
                  </span>
                </article>
              ) : (
                <div className="glass absolute inset-0 grid place-items-center rounded-[28px] p-8 text-center">
                  <div>
                    <p className="text-lg font-bold">Nobody left in this pool</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Turn another area back on, or reshuffle the deck.
                    </p>
                    <button
                      onClick={() => {
                        setDeck(makeCandidates(24));
                        setPassed(0);
                      }}
                      className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background"
                    >
                      Reshuffle the deck
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => resolve("pass")}
                disabled={!top}
                className="rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold disabled:opacity-40"
              >
                ✕ Pass
              </button>
              <span className="font-mono text-xs text-muted-foreground">{passed} passed</span>
              <button
                onClick={() => resolve("like")}
                disabled={!top}
                className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-coral-foreground disabled:opacity-40"
              >
                ✎ Write to them
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Drag the card with a mouse or finger, tap it to read the whole card, or use these
              buttons.
            </p>
          </section>

          {/* Settings */}
          <section className="lg:col-span-5">
            <fieldset className="glass rounded-[28px] p-6">
              <legend className="text-sm font-semibold">Who should I meet?</legend>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={mode === "pair"}
                  onClick={() => setMode("pair")}
                  className={`rounded-3xl border p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    mode === "pair" ? "border-teal bg-teal/10" : "border-line bg-card"
                  }`}
                >
                  <span className="text-2xl font-extrabold">1 : 1</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    A single anonymous pen pal
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "group"}
                  onClick={() => setMode("group")}
                  className={`rounded-3xl border p-4 text-left transition-transform hover:-translate-y-0.5 ${
                    mode === "group" ? "border-teal bg-teal/10" : "border-line bg-card"
                  }`}
                >
                  <span className="text-2xl font-extrabold">3 – 4</span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    They bring a small crew
                  </span>
                </button>
              </div>
            </fieldset>

            <fieldset className="glass mt-4 rounded-[28px] p-6">
              <legend className="text-sm font-semibold">How long does the thread last?</legend>
              <p className="mt-4 font-mono text-xs text-teal">{DURATION_LABEL[duration]}</p>
              <div aria-hidden="true" className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal to-coral transition-all duration-500"
                  style={{
                    width: duration === "minutes" ? "18%" : duration === "day" ? "58%" : "100%",
                  }}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {DURATIONS.map((d) => (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={duration === d}
                    onClick={() => setDuration(d)}
                    className={`rounded-2xl py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                      duration === d
                        ? "bg-ink text-background"
                        : "border border-line bg-card text-muted-foreground"
                    }`}
                  >
                    {DURATION_LABEL[d]}
                  </button>
                ))}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Short threads vanish on their own — a low-stakes way to try this once.
              </p>
            </fieldset>
          </section>
        </div>

        {threads.length ? (
          <div className="mt-10">
            <h2 className="text-xl font-bold tracking-tight">Your open threads</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {threads.slice(0, 4).map((t) => (
                <Link
                  key={t.id}
                  to="/chat/$threadId"
                  params={{ threadId: t.id }}
                  className="glass rounded-3xl p-4 transition-transform hover:-translate-y-1"
                >
                  <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    {t.mode === "pair" ? "1:1" : `${t.members.length} people`} ·{" "}
                    {DURATION_LABEL[t.duration]}
                  </p>
                  <p className="mt-1 font-bold">
                    {t.members
                      .filter((m) => !m.isMe)
                      .map((m) => (m.revealed ? m.revealedName : m.alias))
                      .join(", ")}
                  </p>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {t.messages[t.messages.length - 1]?.text}
                  </p>
                </Link>
              ))}
            </div>
            <Link to="/threads" className="mt-4 inline-block text-sm font-semibold text-teal">
              See all threads →
            </Link>
          </div>
        ) : null}
      </div>

      {expanded ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Full card for ${expanded.alias}`}
          className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setExpanded(null);
          }}
        >
          <article className="paper animate-pop my-8 w-full max-w-md rounded-[28px] p-6">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              Masked student
            </p>
            <h2 className="mt-1 font-serif text-3xl">{expanded.alias}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {UNIVERSITY_SHORT[expanded.university]} · {expanded.year}
            </p>
            <p className="mt-4 font-serif text-2xl leading-snug text-pretty">“{expanded.line}”</p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-3 rounded-2xl bg-background/70 px-3 py-2">
                <dt className="text-muted-foreground">Shared interest</dt>
                <dd className="text-right font-semibold">{expanded.interest}</dd>
              </div>
              <div className="flex justify-between gap-3 rounded-2xl bg-background/70 px-3 py-2">
                <dt className="text-muted-foreground">Campus</dt>
                <dd className="text-right font-semibold">{expanded.university}</dd>
              </div>
              <div className="flex justify-between gap-3 rounded-2xl bg-background/70 px-3 py-2">
                <dt className="text-muted-foreground">Distance</dt>
                <dd className="text-right text-xs font-semibold">
                  {profile
                    ? travelNote(profile.university, expanded.university)
                    : CAMPUS_AREA[expanded.university]}
                </dd>
              </div>
            </dl>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <button
                onClick={() => {
                  setExpanded(null);
                  resolve("like");
                }}
                className="rounded-full bg-coral px-5 py-3 text-sm font-semibold text-coral-foreground"
              >
                ✎ Write to them
              </button>
              <button
                onClick={() => {
                  setExpanded(null);
                  resolve("pass");
                }}
                className="rounded-full border border-line bg-card px-5 py-3 text-sm font-semibold"
              >
                ✕ Pass
              </button>
            </div>
            <button
              onClick={() => setExpanded(null)}
              className="mt-2 w-full rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground"
            >
              Back to the deck
            </button>
          </article>
        </div>
      ) : null}

      {/* Postmarked match modal */}
      {matched ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Match confirmed"
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"
        >
          <div className="paper animate-pop relative w-full max-w-md overflow-hidden rounded-[28px] p-7 text-center">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-20 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-ink/5"
            />
            <Postmark
              place={UNIVERSITY_SHORT[matched.university]}
              date={new Date()
                .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
                .toUpperCase()}
              className="absolute top-4 right-4"
            />
            <WaxSeal tone="coral" size="lg" animate className="mx-auto mt-8" />
            <p className="mt-4 font-mono text-[10px] tracking-widest text-coral uppercase">
              Postmarked · delivered
            </p>
            <h2 className="mt-1 font-serif text-3xl">You wrote to {matched.alias}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {matched.university} · matched on {matched.interest} ·{" "}
              {DURATION_LABEL[duration].toLowerCase()}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={confirmMatch}
                className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background"
              >
                Open the thread
              </button>
              <button
                onClick={() => setMatched(null)}
                className="rounded-full border border-line bg-card px-6 py-3 text-sm font-semibold"
              >
                Keep swiping
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </MistShell>
  );
}
