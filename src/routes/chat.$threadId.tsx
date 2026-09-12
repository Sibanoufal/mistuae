import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MistShell } from "@/components/MistShell";
import { ReportDialog } from "@/components/ReportDialog";
import { DURATION_LABEL, formatCountdown, useMist } from "@/lib/mist-store";

export const Route = createFileRoute("/chat/$threadId")({
  head: () => ({
    meta: [
      { title: "Anonymous thread — Mist" },
      {
        name: "description",
        content:
          "Chat behind a mask with a verified UAE student, watch the thread timer, and lift your mask whenever you're ready.",
      },
      { property: "og:title", content: "Anonymous thread — Mist" },
      {
        property: "og:description",
        content: "A masked conversation with a verified UAE university student.",
      },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { threadId } = Route.useParams();
  const { threads, sendMessage, offerReveal, extendThread, closeThread, ready, blockAlias, reportAlias } =
    useMist();
  const thread = threads.find((t) => t.id === threadId);
  const [draft, setDraft] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const [reporting, setReporting] = useState<string | null>(null);
  const [reportSent, setReportSent] = useState(false);
  const [blockedNotice, setBlockedNotice] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [thread?.messages.length]);

  if (!ready) {
    return (
      <MistShell>
        <p className="py-16 text-center text-muted-foreground">Opening your envelope…</p>
      </MistShell>
    );
  }

  if (!thread) {
    return (
      <MistShell>
        <div className="glass mx-auto my-16 max-w-md rounded-[32px] p-8 text-center">
          <h1 className="text-2xl font-extrabold">This thread has drifted away</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have expired, or it belongs to a different device.
          </p>
          <Link
            to="/match"
            className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background"
          >
            Find a new match
          </Link>
        </div>
      </MistShell>
    );
  }

  const others = thread.members.filter((m) => !m.isMe);
  const remaining = thread.expiresAt ? thread.expiresAt - now : null;
  const expired = remaining !== null && remaining <= 0;
  const locked = expired || thread.closed;

  return (
    <MistShell>
      <div className="grid gap-5 py-6 lg:grid-cols-12">
        <section className="glass rounded-[28px] p-4 sm:p-6 lg:col-span-8">
          <header className="flex flex-wrap items-center gap-3 border-b border-line pb-4">
            <div className="flex -space-x-2">
              {others.map((m) => (
                <span
                  key={m.alias}
                  className={`grid size-11 place-items-center rounded-full font-mono text-[10px] ring-2 ring-background ${
                    m.revealed ? "animate-unblur bg-teal text-teal-foreground" : "bg-surface"
                  }`}
                  aria-hidden="true"
                >
                  {m.revealed
                    ? m.revealedName.slice(0, 2)
                    : m.alias
                        .split(" ")
                        .map((w) => w[0])
                        .join("")}
                </span>
              ))}
            </div>
            <div className="min-w-0">
              <p className="truncate font-bold">
                {others.map((m) => (m.revealed ? m.revealedName : m.alias)).join(", ")}
              </p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {others.map((m) => m.university).join(" · ")}
              </p>
            </div>
            <span className="ml-auto font-mono text-[11px] text-coral">
              {remaining === null
                ? "open forever"
                : expired
                  ? "thread closed"
                  : `${formatCountdown(remaining)} left`}
            </span>
          </header>

          <div ref={listRef} className="mt-4 max-h-[46vh] space-y-2.5 overflow-y-auto pr-1 text-sm">
            {thread.messages.map((m) =>
              m.system ? (
                <p
                  key={m.id}
                  className="mx-auto max-w-[85%] rounded-full bg-surface/70 px-4 py-2 text-center font-mono text-[11px] text-muted-foreground"
                >
                  {m.text}
                </p>
              ) : m.author === "me" ? (
                <div
                  key={m.id}
                  className="ml-auto max-w-[80%] animate-pop rounded-2xl rounded-tr-md bg-teal px-4 py-2.5 text-teal-foreground"
                >
                  {m.text}
                </div>
              ) : (
                <div key={m.id} className="max-w-[80%] animate-pop">
                  {thread.mode === "group" ? (
                    <p className="mb-0.5 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {thread.members.find((x) => x.alias === m.author)?.revealed
                        ? thread.members.find((x) => x.alias === m.author)?.revealedName
                        : m.author}
                    </p>
                  ) : null}
                  <div className="rounded-2xl rounded-tl-md bg-ink/5 px-4 py-2.5">{m.text}</div>
                </div>
              ),
            )}
          </div>

          <form
            className="mt-4 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (locked) return;
              sendMessage(thread.id, draft);
              setDraft("");
            }}
          >
            <label htmlFor="msg" className="sr-only">
              Write a message
            </label>
            <input
              id="msg"
              value={draft}
              maxLength={500}
              disabled={locked}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={locked ? "This thread is closed" : "Say something anonymous…"}
              className="flex-1 rounded-full border border-line bg-card px-4 py-3 text-sm disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={locked || !draft.trim()}
              className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-background disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </section>

        <aside className="glass flex flex-col rounded-[28px] p-5 sm:p-6 lg:col-span-4">
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Reveal
          </p>
          <h2 className="mt-2 text-2xl leading-tight font-extrabold">
            You can un-blur each other.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Lift your mask whenever you like. They are never forced to lift theirs.
          </p>

          <div className="mt-5 grid place-items-center">
            <div className="relative grid size-36 place-items-center rounded-full bg-surface/70">
              {!locked ? (
                <span className="ripple-ring absolute inset-0 rounded-full bg-teal/20" />
              ) : null}
              <div className="text-center">
                <p className="text-3xl font-extrabold tabular-nums">
                  {remaining === null ? "∞" : formatCountdown(Math.max(0, remaining))}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  {DURATION_LABEL[thread.duration].toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => offerReveal(thread.id)}
            disabled={thread.myRevealOffered}
            className="mt-5 rounded-full bg-coral py-3 text-sm font-semibold text-coral-foreground disabled:opacity-60"
          >
            {thread.myRevealOffered ? "Your mask is off" : "Lift my mask"}
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => extendThread(thread.id)}
              disabled={thread.duration === "forever" && !locked}
              className="rounded-full border border-line bg-card py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              Keep it open
            </button>
            <button
              onClick={() => closeThread(thread.id)}
              disabled={thread.closed}
              className="rounded-full border border-line bg-card py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              Leave thread
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Shared interest: {thread.sharedInterest}. Either of you can reveal, anytime. No pressure,
            ever.
          </p>

          <div className="mt-4 rounded-2xl border border-line bg-card p-3">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              Feeling uncomfortable?
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReporting(others[0]?.alias ?? thread.members[0]!.alias)}
                className="rounded-full bg-coral/15 py-2.5 text-sm font-semibold text-coral"
              >
                Report
              </button>
              <button
                type="button"
                onClick={() => {
                  const who = others[0]?.alias;
                  if (!who) return;
                  blockAlias(who);
                  setBlockedNotice(who);
                }}
                className="rounded-full border border-line py-2.5 text-sm font-semibold"
              >
                Block
              </button>
            </div>
            {blockedNotice ? (
              <p className="mt-2 text-xs text-muted-foreground" role="status">
                {blockedNotice} is blocked and this thread is closed.
              </p>
            ) : null}
            {reportSent ? (
              <p className="mt-2 text-xs text-muted-foreground" role="status">
                Report sent. Moderators reply within 24 hours.
              </p>
            ) : null}
          </div>

          <Link
            to="/letters"
            className="mt-3 rounded-2xl bg-butter px-4 py-3 text-center text-xs font-semibold text-butter-foreground transition-transform hover:-translate-y-0.5"
          >
            Prefer slow? Write a daily letter instead →
          </Link>
        </aside>
      </div>

      {reporting ? (
        <ReportDialog
          alias={reporting}
          onClose={() => setReporting(null)}
          onReport={(reason, note) => {
            reportAlias(reporting, reason, note);
            setReportSent(true);
            setReporting(null);
          }}
          onBlock={() => {
            reportAlias(reporting, "Blocked from thread", "");
            blockAlias(reporting);
            setBlockedNotice(reporting);
            setReportSent(true);
            setReporting(null);
          }}
        />
      ) : null}

    </MistShell>
  );
}
