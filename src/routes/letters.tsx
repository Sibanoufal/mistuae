import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MistShell } from "@/components/MistShell";
import {
  GREAT_REVEAL_EVENT,
  LETTER_INTERVAL_MS,
  UNIVERSITY_SHORT,
  formatCountdown,
  useMist,
  type Letter,
  type SealColor,
} from "@/lib/mist-store";

export const Route = createFileRoute("/letters")({
  head: () => ({
    meta: [
      { title: "Letter Inbox — daily letters to your anonymous pen pal | Mist" },
      {
        name: "description",
        content:
          "A slow, envelope-style inbox. Read and draft one letter a day to your anonymous UAE pen pal, then agree on the end-of-semester Great Reveal.",
      },
      { property: "og:title", content: "Letter Inbox — Mist" },
      {
        property: "og:description",
        content: "One letter a day. No typing bubbles, no read receipts, just words that were worth waiting for.",
      },
    ],
  }),
  component: Letters,
});

const SEAL_BG: Record<SealColor, string> = {
  coral: "bg-coral",
  teal: "bg-teal",
  lilac: "bg-lilac",
  butter: "bg-butter",
};

const ENVELOPE_TINT: Record<SealColor, string> = {
  coral: "from-coral/25 to-paper",
  teal: "from-teal/25 to-paper",
  lilac: "from-lilac/30 to-paper",
  butter: "from-butter/60 to-paper",
};

function dateStamp(ms: number) {
  return new Date(ms).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).toUpperCase();
}

function Envelope({
  letter,
  active,
  onOpen,
}: {
  letter: Letter;
  active: boolean;
  onOpen: () => void;
}) {
  const unread = !letter.fromMe && !letter.read;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={active}
      aria-label={`${letter.fromMe ? "Sent" : "Received"} letter: ${letter.subject}${unread ? " (unread)" : ""}`}
      className={`group relative w-full overflow-hidden rounded-2xl border bg-gradient-to-br p-4 text-left transition-all hover:-translate-y-1 hover:shadow-[0_18px_30px_-18px_oklch(0.262_0.038_210/0.5)] ${ENVELOPE_TINT[letter.seal]} ${
        active ? "border-ink shadow-[0_18px_30px_-18px_oklch(0.262_0.038_210/0.5)]" : "border-paper-line"
      }`}
    >
      {/* envelope flap */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-10 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-ink/5"
      />
      <span
        aria-hidden="true"
        className={`absolute top-3 left-1/2 grid size-6 -translate-x-1/2 place-items-center rounded-full font-mono text-[8px] text-background ${SEAL_BG[letter.seal]} ${unread ? "animate-seal" : ""}`}
      >
        M
      </span>
      <div className="mt-6 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {letter.fromMe ? "To your pen pal" : "From your pen pal"}
          </p>
          <p className={`mt-0.5 truncate font-serif text-lg ${unread ? "font-semibold" : ""}`}>
            {letter.subject}
          </p>
        </div>
        <span className="shrink-0 rotate-6 rounded border border-dashed border-paper-line px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-muted-foreground">
          {dateStamp(letter.sentAt)}
        </span>
      </div>
      {unread ? (
        <span className="mt-2 inline-block rounded-full bg-coral px-2 py-0.5 font-mono text-[9px] tracking-widest text-coral-foreground uppercase">
          new
        </span>
      ) : null}
    </button>
  );
}

function Letters() {
  const {
    ready,
    profile,
    penPal,
    letters,
    assignPenPal,
    sendLetter,
    markLetterRead,
    proposeGreatReveal,
  } = useMist();
  const [openId, setOpenId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [seal, setSeal] = useState<SealColor>("coral");
  const [now, setNow] = useState(() => Date.now());
  const [justSent, setJustSent] = useState(false);

  useEffect(() => {
    if (ready && profile && !penPal) assignPenPal();
  }, [ready, profile, penPal, assignPenPal]);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const sorted = useMemo(() => [...letters].sort((a, b) => b.sentAt - a.sentAt), [letters]);
  const open = sorted.find((l) => l.id === openId) ?? sorted[0] ?? null;

  useEffect(() => {
    if (open && !open.fromMe && !open.read) markLetterRead(open.id);
  }, [open, markLetterRead]);

  const lastMine = letters.filter((l) => l.fromMe).sort((a, b) => b.sentAt - a.sentAt)[0];
  const nextAllowedAt = lastMine ? lastMine.sentAt + LETTER_INTERVAL_MS : 0;
  const canSend = now >= nextAllowedAt;
  const awaitingReply = lastMine && !letters.some((l) => !l.fromMe && l.sentAt > lastMine.sentAt);

  if (ready && !profile) {
    return (
      <MistShell>
        <div className="paper mx-auto my-16 max-w-md rounded-[28px] p-8 text-center">
          <p className="font-mono text-[11px] tracking-widest text-coral uppercase">Letter inbox</p>
          <h1 className="mt-2 font-serif text-3xl">Your pen pal is waiting on a stamp.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Verify your student ID once and we assign you an anonymous pen pal for the semester.
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

  const gr = penPal?.greatReveal;

  return (
    <MistShell>
      <div className="py-6 sm:py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-widest text-coral uppercase">
              Letter inbox · slow post
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-none text-balance sm:text-5xl">
              Dear <span className="italic text-teal">{penPal?.alias ?? "stranger"}</span>,
            </h1>
            <p className="mt-2 max-w-[50ch] text-sm text-pretty text-muted-foreground">
              One letter a day, each way. No typing dots, no read receipts. Your pen pal is a
              verified student at{" "}
              <strong className="text-ink">
                {penPal ? UNIVERSITY_SHORT[penPal.university] : "another campus"}
              </strong>
              {penPal && profile && penPal.university !== profile.university
                ? " — a different campus from yours."
                : "."}
            </p>
          </div>
          <div className="hidden rotate-3 rounded-lg border-2 border-dashed border-coral/60 px-3 py-2 text-center font-mono text-[10px] tracking-widest text-coral uppercase sm:block">
            Post
            <br />
            1 / day
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          {/* Inbox */}
          <section aria-label="Envelopes" className="lg:col-span-4">
            <div className="glass rounded-[28px] p-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold">Envelopes</h2>
                <span className="font-mono text-[10px] text-muted-foreground">{sorted.length}</span>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {awaitingReply ? (
                  <div className="rounded-2xl border border-dashed border-paper-line bg-paper/60 p-4 text-center">
                    <span className="inline-block animate-wobble text-2xl" aria-hidden="true">
                      ✉️
                    </span>
                    <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      Reply in transit
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Real post arrives next morning · demo delivers in under a minute
                    </p>
                  </div>
                ) : null}
                {sorted.map((l) => (
                  <Envelope
                    key={l.id}
                    letter={l}
                    active={open?.id === l.id}
                    onOpen={() => setOpenId(l.id)}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Reading pane */}
          <section aria-label="Open letter" className="lg:col-span-8">
            {open ? (
              <article className="paper relative rounded-[28px] p-6 sm:p-9">
                <span
                  aria-hidden="true"
                  className={`absolute top-5 right-5 grid size-12 rotate-12 place-items-center rounded-full font-mono text-xs text-background sticker ${SEAL_BG[open.seal]}`}
                >
                  M
                </span>
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {open.fromMe ? `You → ${penPal?.alias}` : `${penPal?.alias} → ${profile?.alias}`} ·{" "}
                  {new Date(open.sentAt).toLocaleString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                <h2 className="mt-2 pr-14 font-serif text-3xl leading-tight text-balance">
                  {open.subject}
                </h2>
                <div className="mt-5 max-w-[62ch] font-serif text-lg leading-7 whitespace-pre-line">
                  {open.body}
                </div>
              </article>
            ) : (
              <div className="paper grid min-h-64 place-items-center rounded-[28px] p-8 text-center text-muted-foreground">
                Sorting the post…
              </div>
            )}

            {/* Draft */}
            <form
              className="glass mt-5 rounded-[28px] p-5 sm:p-7"
              onSubmit={(e) => {
                e.preventDefault();
                if (!canSend || !body.trim()) return;
                sendLetter(subject, body, seal);
                setSubject("");
                setBody("");
                setJustSent(true);
                window.setTimeout(() => setJustSent(false), 2400);
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-semibold">Draft today&apos;s letter</h2>
                <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  {canSend
                    ? "Post open"
                    : `Next letter in ${formatCountdown(nextAllowedAt - now)}`}
                </p>
              </div>
              <label htmlFor="subject" className="sr-only">
                Subject
              </label>
              <input
                id="subject"
                value={subject}
                maxLength={80}
                disabled={!canSend}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject — e.g. Things I noticed on the metro"
                className="mt-3 w-full rounded-2xl border border-line bg-card px-4 py-3 font-serif text-lg disabled:opacity-60"
              />
              <label htmlFor="body" className="sr-only">
                Letter body
              </label>
              <textarea
                id="body"
                value={body}
                rows={6}
                maxLength={2000}
                disabled={!canSend}
                onChange={(e) => setBody(e.target.value)}
                placeholder={
                  canSend
                    ? "Dear stranger,\n\nTake your time. This is the only letter you get to send today."
                    : "You've posted today's letter. Come back tomorrow — slow is the point."
                }
                className="paper mt-3 w-full resize-y rounded-2xl px-4 py-3 font-serif text-lg leading-7 disabled:opacity-60"
              />
              <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <fieldset className="flex min-w-0 items-center gap-2">
                  <legend className="sr-only">Wax seal colour</legend>
                  <span className="hidden font-mono text-[10px] tracking-widest text-muted-foreground uppercase sm:inline">
                    Seal
                  </span>
                  {(["coral", "teal", "lilac", "butter"] as SealColor[]).map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-label={`${c} seal`}
                      aria-pressed={seal === c}
                      onClick={() => setSeal(c)}
                      className={`size-7 rounded-full ${SEAL_BG[c]} transition-transform hover:scale-110 ${
                        seal === c ? "ring-2 ring-ink ring-offset-2 ring-offset-background" : ""
                      }`}
                    />
                  ))}
                </fieldset>
                <button
                  type="submit"
                  disabled={!canSend || !body.trim()}
                  className="rounded-full bg-ink px-5 py-3 text-sm font-semibold whitespace-nowrap text-background transition-transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {justSent ? "Sealed ✓" : "Seal & post"}
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                <span className="font-mono">{body.length}/2000</span> · Letters are deliberately
                slow: one per day keeps this from becoming another feed to refresh.
              </p>
            </form>
          </section>
        </div>

        {/* Great Reveal */}
        <section
          aria-labelledby="great-reveal"
          className="relative mt-8 overflow-hidden rounded-[32px] bg-ink p-6 text-background sm:p-10"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-lilac/40 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 left-10 size-72 rounded-full bg-coral/30 blur-3xl"
          />
          <div className="relative grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="font-mono text-[11px] tracking-widest text-butter uppercase">
                Optional · end of semester
              </p>
              <h2 id="great-reveal" className="mt-2 font-serif text-4xl leading-none sm:text-5xl">
                {GREAT_REVEAL_EVENT.name}
              </h2>
              <p className="mt-3 max-w-[54ch] text-pretty text-background/75">
                When term ends, you and your pen pal can <strong className="text-background">both</strong>{" "}
                agree to unlock real identities and meet at an official campus booth. One
                &ldquo;yes&rdquo; alone changes nothing — it only happens if you both want it.
              </p>
              <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-2xl bg-background/10 p-3">
                  <dt className="font-mono text-[10px] tracking-widest text-background/60 uppercase">
                    When
                  </dt>
                  <dd className="mt-0.5 font-semibold">{GREAT_REVEAL_EVENT.date}</dd>
                </div>
                <div className="rounded-2xl bg-background/10 p-3">
                  <dt className="font-mono text-[10px] tracking-widest text-background/60 uppercase">
                    Where
                  </dt>
                  <dd className="mt-0.5 font-semibold">{GREAT_REVEAL_EVENT.venue}</dd>
                  <dd className="text-xs text-background/60">{GREAT_REVEAL_EVENT.note}</dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-background p-5 text-ink">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    Mutual agreement
                  </p>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {(gr?.mine ? 1 : 0) + (gr?.theirs ? 1 : 0)} / 2
                  </span>
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex items-center justify-between rounded-2xl bg-surface/70 px-3 py-2">
                    <span>{profile?.alias ?? "You"}</span>
                    <span className={`font-mono text-[10px] uppercase ${gr?.mine ? "text-teal" : "text-muted-foreground"}`}>
                      {gr?.mine ? "agreed ✓" : "undecided"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between rounded-2xl bg-surface/70 px-3 py-2">
                    <span>{penPal?.alias ?? "Pen pal"}</span>
                    <span className={`font-mono text-[10px] uppercase ${gr?.theirs ? "text-teal" : "text-muted-foreground"}`}>
                      {gr?.theirs ? "agreed ✓" : gr?.mine ? "thinking…" : "undecided"}
                    </span>
                  </li>
                </ul>

                {gr?.agreedAt ? (
                  <div className="animate-pop mt-4 rounded-2xl border-2 border-dashed border-coral/60 bg-gradient-to-br from-butter/60 to-coral/20 p-4">
                    <p className="font-mono text-[10px] tracking-widest text-coral uppercase">
                      Ticket · admit two
                    </p>
                    <p className="mt-1 font-serif text-2xl">
                      {profile?.realName} <span className="text-muted-foreground">meets</span>{" "}
                      {penPal?.revealedName}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Names unlock for both of you now. Show this at the booth on{" "}
                      {GREAT_REVEAL_EVENT.date}.
                    </p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={proposeGreatReveal}
                    disabled={!penPal || gr?.mine}
                    className="mt-4 w-full rounded-full bg-coral py-3 text-sm font-semibold text-coral-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  >
                    {gr?.mine ? "Waiting for your pen pal…" : "I'm in for the Great Reveal"}
                  </button>
                )}
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  You can withdraw any time before the event. Nothing is shared until both agree.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MistShell>
  );
}
