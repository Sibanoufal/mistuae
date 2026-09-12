import { createFileRoute, Link } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";
import { WaxSeal, type SealTone } from "@/components/Postal";
import { DURATION_LABEL, UNIVERSITY_SHORT, useMist } from "@/lib/mist-store";

export const Route = createFileRoute("/threads")({
  head: () => ({
    meta: [
      { title: "Your anonymous threads — Mist" },
      {
        name: "description",
        content: "Every anonymous pen pal thread you have open on Mist, and who has revealed so far.",
      },
      { property: "og:title", content: "Your anonymous threads — Mist" },
      {
        property: "og:description",
        content: "Keep track of your masked conversations, letters and reveals.",
      },
    ],
  }),
  component: Threads,
});

type Event = { at: number; tone: SealTone; label: string; text: string };

function Threads() {
  const { threads, profile, signOut, letters, penPal, posts } = useMist();

  const timeline: Event[] = [
    ...letters.map((l) => ({
      at: l.sentAt,
      tone: (l.fromMe ? "coral" : "lilac") as SealTone,
      label: l.fromMe ? "Posted" : "Delivered",
      text: l.fromMe ? `You sealed “${l.subject}”` : `${penPal?.alias ?? "Your pen pal"} wrote “${l.subject}”`,
    })),
    ...threads.map((t) => ({
      at: t.createdAt,
      tone: "teal" as SealTone,
      label: "Matched",
      text: `Masked thread with ${t.members.filter((m) => !m.isMe).map((m) => m.alias).join(", ")} · ${DURATION_LABEL[t.duration]}`,
    })),
    ...threads
      .flatMap((t) => t.members.filter((m) => m.revealed && !m.isMe).map((m) => ({ t, m })))
      .map(({ m }) => ({
        at: Date.now(),
        tone: "butter" as SealTone,
        label: "Unmasked",
        text: `${m.alias} lifted their mask — ${m.revealedName}`,
      })),
    ...posts
      .filter((p) => p.joined)
      .map((p) => ({
        at: Date.now(),
        tone: "teal" as SealTone,
        label: "Joined",
        text: `You answered “${p.title}” at ${UNIVERSITY_SHORT[p.university]}`,
      })),
    ...(penPal
      ? [
          {
            at: penPal.since,
            tone: "lilac" as SealTone,
            label: "Assigned",
            text: `${penPal.alias} became your pen pal for the semester`,
          },
        ]
      : []),
  ].sort((a, b) => b.at - a.at);

  return (
    <MistShell>
      <div className="py-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[11px] tracking-widest text-coral uppercase">Your mask</p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {profile ? profile.alias : "Not verified yet"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {profile
                ? `${profile.university} · ${profile.year} · verified by student email`
                : "Verify your student email to start."}
            </p>
            {profile ? (
              <Link to="/letters" className="mt-2 inline-block text-sm font-semibold text-plum">
                Open your letter inbox →
              </Link>
            ) : null}
          </div>
          {profile ? (
            <button
              onClick={signOut}
              className="rounded-full border border-line bg-card px-5 py-2.5 text-sm font-semibold"
            >
              Sign out & erase my data
            </button>
          ) : (
            <Link
              to="/join"
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background"
            >
              Verify student email
            </Link>
          )}
        </div>

        {threads.length === 0 ? (
          <div className="glass mt-8 rounded-[32px] p-10 text-center">
            <p className="text-lg font-bold">No masked threads yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Swipe the deck and your conversations will live here.
            </p>
            <Link
              to="/match"
              className="mt-5 inline-block rounded-full bg-coral px-6 py-3 text-sm font-semibold text-coral-foreground"
            >
              Open the deck
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {threads.map((t) => (
              <Link
                key={t.id}
                to="/chat/$threadId"
                params={{ threadId: t.id }}
                className="glass rounded-3xl p-5 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    {t.mode === "pair" ? "1:1" : `${t.members.length} people`} ·{" "}
                    {DURATION_LABEL[t.duration]}
                  </p>
                  {t.closed ? (
                    <span className="rounded-full bg-ink/10 px-2 py-0.5 font-mono text-[10px] uppercase">
                      closed
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-lg font-bold">
                  {t.members
                    .filter((m) => !m.isMe)
                    .map((m) => (m.revealed ? m.revealedName : m.alias))
                    .join(", ")}
                </p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {t.messages[t.messages.length - 1]?.text}
                </p>
              </Link>
            ))}
          </div>
        )}

        {/* Wax-sealed activity timeline */}
        {timeline.length ? (
          <section aria-labelledby="timeline" className="mt-10">
            <h2 id="timeline" className="text-xl font-bold tracking-tight">
              Your postal history
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every letter, match and reveal, sealed in order.
            </p>
            <ol className="relative mt-6 space-y-4 border-l-2 border-dashed border-paper-line pl-8">
              {timeline.slice(0, 12).map((e, i) => (
                <li key={i} className="relative">
                  <WaxSeal
                    tone={e.tone}
                    size="sm"
                    label={e.label[0]}
                    className="absolute top-1 -left-[42px]"
                  />
                  <div className="paper rounded-2xl p-4">
                    <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      {e.label} ·{" "}
                      {new Date(e.at).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-1 text-sm font-medium text-pretty">{e.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </MistShell>
  );
}
