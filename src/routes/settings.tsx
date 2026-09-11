import { createFileRoute, Link } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";
import { useMist } from "@/lib/mist-store";
import { COMMUNITY_RULES, MATCH_WITH, TRUST_TAGS } from "@/lib/mist-social";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Safety & controls — Mist" },
      {
        name: "description",
        content:
          "Choose who you interact with, hide from discovery, review your trust ratings, and manage blocks and reports. Safety controls built in from day one.",
      },
      { property: "og:title", content: "Safety & controls — Mist" },
      {
        property: "og:description",
        content: "Interaction preferences, discovery visibility, blocks, reports and trust ratings in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { profile, saveProfile, setDiscoverable, blocked, unblockAlias, reports, ratings } = useMist();

  if (!profile) {
    return (
      <MistShell>
        <section className="glass mt-8 rounded-3xl p-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">Safety & controls</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Verify your student ID to set your interaction preferences.
          </p>
          <Link to="/join" className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-background">
            Get verified
          </Link>
        </section>
      </MistShell>
    );
  }

  const discoverable = profile.discoverable !== false;

  return (
    <MistShell>
      <section className="mt-6 sm:mt-10">
        <p className="font-mono text-[11px] tracking-widest text-teal uppercase">Safety & controls</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">You set the terms.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Mist is gender-neutral by default and strict by design. Everything below is yours to change at any time.
        </p>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="glass rounded-3xl p-5">
          <h2 className="text-lg font-bold">Who I want to interact with</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Applied to matching, recommendations and group invites — in both directions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {MATCH_WITH.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => saveProfile({ ...profile, matchWith: m.id })}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  (profile.matchWith ?? "everyone") === m.id
                    ? "bg-ink text-background"
                    : "bg-ink/5 hover:bg-ink/10"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </article>

        <article className="glass rounded-3xl p-5">
          <h2 className="text-lg font-bold">Discovery</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Turn this off and you disappear from recommendations, the match pool and room member lists. Existing
            chats stay open.
          </p>
          <button
            type="button"
            onClick={() => setDiscoverable(!discoverable)}
            aria-pressed={discoverable}
            className={`mt-4 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
              discoverable ? "bg-mint text-ink" : "bg-ink text-background"
            }`}
          >
            {discoverable ? "Visible in discovery — tap to hide" : "Hidden from discovery — tap to appear"}
          </button>
        </article>

        <article className="glass rounded-3xl p-5">
          <h2 className="text-lg font-bold">Blocked aliases</h2>
          {blocked.length ? (
            <ul className="mt-3 space-y-2">
              {blocked.map((a) => (
                <li key={a} className="flex items-center justify-between rounded-2xl bg-ink/5 px-3 py-2 text-sm">
                  <span>{a}</span>
                  <button
                    type="button"
                    onClick={() => unblockAlias(a)}
                    className="font-mono text-[11px] tracking-wide text-teal uppercase"
                  >
                    unblock
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Nobody blocked. You can block from any chat or room message.
            </p>
          )}
          <p className="mt-3 font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
            {reports.length} report{reports.length === 1 ? "" : "s"} filed
          </p>
        </article>

        <article className="glass rounded-3xl p-5">
          <h2 className="text-lg font-bold">Trust ratings you've given</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Private and reliability-based — never popularity. Tags people can earn:{" "}
            {TRUST_TAGS.join(", ")}.
          </p>
          {ratings.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {ratings.map((r) => (
                <li key={`${r.alias}-${r.at}`} className="rounded-2xl bg-butter/40 px-3 py-2">
                  <strong>{r.alias}</strong> — {r.tags.join(", ")}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              You'll be asked once a chat ends. It stays private to moderation.
            </p>
          )}
        </article>
      </div>

      <section className="glass mt-6 rounded-3xl p-5 sm:p-6">
        <h2 className="text-lg font-bold">The rules everyone agreed to</h2>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {COMMUNITY_RULES.map((rule) => (
            <li key={rule.title} className="rounded-2xl bg-ink/5 px-3 py-2">
              <strong className="text-ink">◆ {rule.title}</strong> — {rule.body}
            </li>
          ))}
        </ul>
        <p className="mt-4 rounded-2xl bg-coral/15 px-4 py-3 text-sm">
          Your student ID photo is never shown to anyone. It is checked once at sign-up, then all anyone ever sees
          is a <strong>✓ Verified student</strong> badge.
        </p>
      </section>
    </MistShell>
  );
}
