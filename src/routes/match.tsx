import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MistShell } from "@/components/MistShell";
import {
  DURATION_LABEL,
  useMist,
  type ChatDuration,
  type ChatMode,
} from "@/lib/mist-store";

export const Route = createFileRoute("/match")({
  head: () => ({
    meta: [
      { title: "Get matched anonymously — Mist" },
      {
        name: "description",
        content:
          "Choose a one-to-one pen pal or a small anonymous crew, set how long the thread lasts, and get matched with a verified UAE student.",
      },
      { property: "og:title", content: "Get matched anonymously — Mist" },
      {
        property: "og:description",
        content: "Pick pair or group, set your clock, and meet a masked student in seconds.",
      },
    ],
  }),
  component: Match,
});

const DURATIONS: ChatDuration[] = ["minutes", "day", "forever"];

function Match() {
  const navigate = useNavigate();
  const { profile, createThread, threads, ready } = useMist();
  const [mode, setMode] = useState<ChatMode>("pair");
  const [duration, setDuration] = useState<ChatDuration>("day");
  const [interest, setInterest] = useState<string>(profile?.interests[0] ?? "Design");
  const [searching, setSearching] = useState(false);

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

  function go() {
    setSearching(true);
    window.setTimeout(() => {
      const t = createThread({ mode, duration, sharedInterest: interest });
      navigate({ to: "/chat/$threadId", params: { threadId: t.id } });
    }, 1800);
  }

  return (
    <MistShell>
      <div className="py-8">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase">Step 2 of 2</p>
        <h1 className="mt-3 max-w-[18ch] text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
          Pick your shape. Set your clock.
        </h1>
        <p className="mt-3 max-w-[52ch] text-pretty text-muted-foreground">
          A one-on-one or a little crew, and how long the thread stays open. You can always extend it
          later if you both want to.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
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
              Match me around
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
            <div
              aria-hidden="true"
              className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10"
            >
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
        </div>

        <button
          onClick={go}
          disabled={searching}
          className="mt-6 w-full rounded-full bg-coral py-4 text-base font-semibold text-coral-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-70"
        >
          {searching ? "Finding someone…" : "Seal the envelope & match me"}
        </button>

        {searching ? (
          <div
            role="status"
            className="glass mt-6 grid place-items-center rounded-[28px] p-10 text-center"
          >
            <div className="relative grid size-24 place-items-center">
              <span className="ripple-ring absolute inset-0 rounded-full bg-teal/25" />
              <span className="grid size-16 place-items-center rounded-full bg-teal text-teal-foreground">
                ?
              </span>
            </div>
            <p className="mt-4 font-semibold">Dropping you into the pool…</p>
            <p className="text-sm text-muted-foreground">
              Matching on “{interest}” · {DURATION_LABEL[duration]}
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
