import { createFileRoute, Link } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";
import { DURATION_LABEL, useMist } from "@/lib/mist-store";

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
        content: "Keep track of your masked conversations and reveals.",
      },
    ],
  }),
  component: Threads,
});

function Threads() {
  const { threads, profile, signOut } = useMist();

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
                ? `${profile.university} · ${profile.year} · verified by student ID`
                : "Verify your student ID to start."}
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
              Verify student ID
            </Link>
          )}
        </div>

        {threads.length === 0 ? (
          <div className="glass mt-8 rounded-[32px] p-10 text-center">
            <p className="text-lg font-bold">No threads yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Get matched and your conversations will live here.
            </p>
            <Link
              to="/match"
              className="mt-5 inline-block rounded-full bg-coral px-6 py-3 text-sm font-semibold text-coral-foreground"
            >
              Find a match
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
      </div>
    </MistShell>
  );
}
