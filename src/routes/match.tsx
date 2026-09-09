import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { MistShell } from "@/components/MistShell";
import {
  CANDIDATES,
  DURATION_LABEL,
  UNIVERSITIES,
  UNIVERSITY_SHORT,
  useMist,
  type ChatDuration,
  type ChatMode,
  type University,
} from "@/lib/mist-store";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Swipe the masked pool — Mist" },
      {
        name: "description",
        content:
          "Drag through masked students from ten UAE campuses, filter the pool live, then open a one-to-one or small-crew anonymous thread.",
      },
      { property: "og:title", content: "Swipe the masked pool — Mist" },
      {
        property: "og:description",
        content: "A draggable deck of masked students, a live campus filter, and a clock you control.",
      },
    ],
  }),
  component: Match,
});

const DURATIONS: ChatDuration[] = ["minutes", "day", "forever"];

type Candidate = (typeof CANDIDATES)[number];

function SwipeCard({
  candidate,
  onDecide,
}: {
  candidate: Candidate;
  onDecide: (dir: "yes" | "no") => void;
}) {
  const [dx, setDx] = useState(0);
  const [flying, setFlying] = useState<0 | 1 | -1>(0);
  const startX = useRef(0);
  const dragging = useRef(false);

  function release() {
    if (!dragging.current) return;
    dragging.current = false;
    if (Math.abs(dx) > 110) {
      const dir = dx > 0 ? 1 : -1;
      setFlying(dir);
      window.setTimeout(() => onDecide(dir > 0 ? "yes" : "no"), 220);
    } else {
      setDx(0);
    }
  }

  const rot = dx / 18;
  const translate = flying ? flying * 700 : dx;

  return (
    <div
      role="group"
      aria-label={`${candidate.alias} from ${candidate.university}`}
      onPointerDown={(e) => {
        dragging.current = true;
        startX.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!dragging.current) return;
        setDx(e.clientX - startX.current);
      }}
      onPointerUp={release}
      onPointerCancel={release}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onDecide("yes");
        if (e.key === "ArrowLeft") onDecide("no");
      }}
      tabIndex={0}
      style={{
        transform: `translateX(${translate}px) rotate(${flying ? flying * 18 : rot}deg)`,
        transition: dragging.current ? "none" : "transform 220ms cubic-bezier(0.32,0.72,0,1)",
        opacity: flying ? 0 : 1,
      }}
      className="paper absolute inset-0 cursor-grab touch-none rounded-[28px] p-6 select-none active:cursor-grabbing"
    >
      <span
        aria-hidden="true"
        className="absolute top-5 right-5 grid size-14 rotate-12 place-items-center rounded-full border-2 border-dashed border-coral/60 text-center font-mono text-[8px] leading-tight tracking-widest text-coral uppercase"
      >
        Post
        <br />
        marked
      </span>
      <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        {UNIVERSITY_SHORT[candidate.university]} · {candidate.year}
      </p>
      <h3 className="mt-1 font-serif text-3xl">{candidate.alias}</h3>
      <p className="mt-1 inline-block rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal">
        {candidate.interest}
      </p>
      <p className="mt-5 max-w-[34ch] font-serif text-lg leading-7 text-pretty">
        &ldquo;{candidate.line}&rdquo;
      </p>
      <p className="absolute bottom-5 left-6 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        Drag · or ← / →
      </p>

      <span
        aria-hidden="true"
        style={{ opacity: Math.max(0, Math.min(1, dx / 110)) }}
        className="absolute top-1/2 left-6 -rotate-12 rounded-xl border-4 border-teal px-3 py-1 font-mono text-lg tracking-widest text-teal uppercase"
      >
        Write
      </span>
      <span
        aria-hidden="true"
        style={{ opacity: Math.max(0, Math.min(1, -dx / 110)) }}
        className="absolute top-1/2 right-6 rotate-12 rounded-xl border-4 border-coral px-3 py-1 font-mono text-lg tracking-widest text-coral uppercase"
      >
        Pass
      </span>
    </div>
  );
}

function Match() {
  const navigate = useNavigate();
  const { profile, createThread, threads, ready } = useMist();
  const [mode, setMode] = useState<ChatMode>("pair");
  const [duration, setDuration] = useState<ChatDuration>("day");
  const [interest, setInterest] = useState<string>(profile?.interests[0] ?? "Design");
  const [campuses, setCampuses] = useState<University[]>([...UNIVERSITIES]);
  const [index, setIndex] = useState(0);
  const [passed, setPassed] = useState(0);
  const [searching, setSearching] = useState(false);

  const pool = useMemo(
    () => CANDIDATES.filter((c) => campuses.includes(c.university)),
    [campuses],
  );
  const current = pool[index % Math.max(1, pool.length)];

  if (ready && !profile) {
    return (
      <MistShell>
        <div className="glass mx-auto my-16 max-w-md rounded-[32px] p-8 text-center">
          <h1 className="text-2xl font-extrabold">Verify first</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Mist is students-only, so we need your student ID photo before matching you.
          </p>
          <Link
            to="/join"
            className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background"
          >
            Verify my student ID
          </Link>
        </div>
      </MistShell>
    );
  }

  function toggleCampus(u: University) {
    setIndex(0);
    setCampuses((prev) =>
      prev.includes(u) ? prev.filter((x) => x !== u) : [...prev, u],
    );
  }

  function decide(dir: "yes" | "no") {
    if (dir === "no") {
      setPassed((p) => p + 1);
      setIndex((i) => i + 1);
      return;
    }
    const partner = current;
    setSearching(true);
    window.setTimeout(() => {
      const t = createThread(
        partner
          ? {
              mode,
              duration,
              sharedInterest: partner.interest,
              partner: { alias: partner.alias, university: partner.university },
            }
          : { mode, duration, sharedInterest: interest },
      );
      navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
    }, 1200);
  }

  return (
    <MistShell>
      <div className="py-8">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase">Step 2 of 2</p>
        <h1 className="mt-3 max-w-[18ch] text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
          Drag through the masked pool.
        </h1>
        <p className="mt-3 max-w-[52ch] text-pretty text-muted-foreground">
          Every card is a verified student behind a mask. Filter the pool by campus and watch it
          shrink live — then swipe right to open a thread.
        </p>

        {/* Live campus filter */}
        <section aria-labelledby="filter" className="glass mt-7 rounded-[28px] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="filter" className="text-sm font-semibold">
              Live campus filter
            </h2>
            <p className="font-mono text-xs text-teal">
              <span className="text-2xl font-bold tabular-nums">{pool.length}</span> / {CANDIDATES.length} students in
              your pool
            </p>
          </div>
          <div
            aria-hidden="true"
            className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal via-lilac to-coral transition-all duration-500"
              style={{ width: `${(pool.length / CANDIDATES.length) * 100}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {UNIVERSITIES.map((u) => {
              const on = campuses.includes(u);
              const count = CANDIDATES.filter((c) => c.university === u).length;
              return (
                <button
                  key={u}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleCampus(u)}
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] tracking-wider uppercase transition-transform hover:-translate-y-0.5 ${
                    on ? "border-teal bg-teal text-teal-foreground" : "border-line bg-card text-muted-foreground"
                  }`}
                >
                  {UNIVERSITY_SHORT[u]} · {count}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => {
                setIndex(0);
                setCampuses(campuses.length === UNIVERSITIES.length ? [] : [...UNIVERSITIES]);
              }}
              className="rounded-full border border-line bg-card px-3 py-1.5 font-mono text-[11px] tracking-wider text-ink uppercase"
            >
              {campuses.length === UNIVERSITIES.length ? "Clear all" : "Select all"}
            </button>
          </div>
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          {/* Deck */}
          <section aria-label="Masked student deck" className="lg:col-span-6">
            <div className="relative h-[340px]">
              {pool.length === 0 ? (
                <div className="paper grid h-full place-items-center rounded-[28px] p-8 text-center text-muted-foreground">
                  No campuses selected — the pool is empty. Turn one back on.
                </div>
              ) : (
                <>
                  <div className="absolute inset-x-4 top-3 h-full rotate-2 rounded-[28px] border border-paper-line bg-paper/70" />
                  <div className="absolute inset-x-2 top-1.5 h-full -rotate-1 rounded-[28px] border border-paper-line bg-paper/85" />
                  {current ? (
                    <SwipeCard key={`${current.alias}-${index}`} candidate={current} onDecide={decide} />
                  ) : null}
                </>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => decide("no")}
                disabled={!current}
                className="flex-1 rounded-full border border-line bg-card py-3 text-sm font-semibold disabled:opacity-50"
              >
                Pass
              </button>
              <span className="font-mono text-[11px] text-muted-foreground">{passed} passed</span>
              <button
                type="button"
                onClick={() => decide("yes")}
                disabled={!current}
                className="flex-1 rounded-full bg-coral py-3 text-sm font-semibold text-coral-foreground disabled:opacity-50"
              >
                Write to them
              </button>
            </div>
          </section>

          {/* Controls */}
          <section className="grid gap-5 lg:col-span-6">
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
                    A small anonymous crew
                  </span>
                </button>
              </div>

              <label htmlFor="interest" className="mt-6 block text-sm font-semibold">
                Fallback interest
              </label>
              <select
                id="interest"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              >
                {(profile?.interests.length ? profile.interests : ["Design"]).map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="glass rounded-[28px] p-6">
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

        {searching ? (
          <div
            role="status"
            className="glass mt-6 grid place-items-center rounded-[28px] p-10 text-center"
          >
            <div className="relative grid size-24 place-items-center">
              <span className="ripple-ring absolute inset-0 rounded-full bg-teal/25" />
              <span className="animate-seal grid size-16 place-items-center rounded-full bg-coral font-mono text-sm text-coral-foreground sticker">
                M
              </span>
            </div>
            <p className="mt-4 font-semibold">Sealing the envelope…</p>
            <p className="text-sm text-muted-foreground">
              Postmarked {DURATION_LABEL[duration]} · {mode === "pair" ? "1:1" : "small crew"}
            </p>
          </div>
        ) : null}

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
    </MistShell>
  );
}
