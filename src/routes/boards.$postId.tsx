import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";
import { Postmark, WaxSeal } from "@/components/Postal";
import {
  BOARD_CTA,
  CAMPUS_AREA,
  UNIVERSITY_SHORT,
  travelNote,
  useMist,
  type BoardKind,
} from "@/lib/mist-store";

export const Route = createFileRoute("/boards/$postId")({
  head: () => ({
    meta: [
      { title: "Invite details — Mist boards" },
      {
        name: "description",
        content:
          "The full plan behind an anonymous Mist invite: where it happens, who is already interested, how far the other campus is, and what happens after you join.",
      },
      { property: "og:title", content: "Invite details — Mist boards" },
      {
        property: "og:description",
        content: "See the plan, the campus, and who else is in — all still anonymous.",
      },
    ],
  }),
  component: PostDetail,
});

const KIND_LABEL: Record<BoardKind, string> = {
  coffee: "Coffee chat",
  event: "Event partner",
  project: "Project collab",
};

function PostDetail() {
  const { postId } = useParams({ from: "/boards/$postId" });
  const { posts, toggleJoin, profile } = useMist();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <MistShell>
        <div className="glass mx-auto my-16 max-w-md rounded-[32px] p-8 text-center">
          <h1 className="text-2xl font-extrabold">This invite has been taken down</h1>
          <Link to="/boards" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background">
            Back to the boards
          </Link>
        </div>
      </MistShell>
    );
  }

  const cta = BOARD_CTA[post.kind];
  const distance = profile ? travelNote(profile.university, post.university) : CAMPUS_AREA[post.university];

  return (
    <MistShell>
      <div className="py-8">
        <Link to="/boards" className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase hover:text-ink">
          ← All invites
        </Link>

        <article className="paper relative mt-4 overflow-hidden rounded-[32px] p-6 sm:p-9">
          <Postmark
            place={UNIVERSITY_SHORT[post.university]}
            date={post.when.split("·")[0]?.trim().slice(0, 12) ?? "Open"}
            className="absolute top-6 right-5 sm:top-8 sm:right-8"
          />
          <p className="font-mono text-[11px] tracking-widest text-coral uppercase">
            {post.emoji ?? "✉"} {KIND_LABEL[post.kind]} · posted anonymously
          </p>
          <h1 className="mt-3 max-w-[22ch] pr-20 font-serif text-4xl leading-tight text-balance sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg text-pretty">{post.body}</p>

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-background/70 p-4">
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">When</dt>
              <dd className="mt-1 font-semibold">{post.when}</dd>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Campus</dt>
              <dd className="mt-1 font-semibold">{post.university}</dd>
              <dd className="text-xs text-muted-foreground">{CAMPUS_AREA[post.university]}</dd>
            </div>
            <div className="rounded-2xl bg-background/70 p-4">
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Getting there
              </dt>
              <dd className="mt-1 text-sm font-semibold">{distance}</dd>
            </div>
          </dl>
        </article>

        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <section className="glass rounded-[28px] p-6 lg:col-span-7">
            <h2 className="text-lg font-bold">The plan</h2>
            <ol className="mt-4 space-y-3">
              {(post.plan ?? ["The host hasn't added a detailed plan — message them after you join."]).map(
                (step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink font-mono text-[11px] text-background">
                      {i + 1}
                    </span>
                    <span className="text-sm text-pretty">{step}</span>
                  </li>
                ),
              )}
            </ol>
            {post.hostNote ? (
              <p className="mt-5 flex items-center gap-3 rounded-2xl bg-mint/50 px-4 py-3 text-sm">
                <WaxSeal tone="teal" size="sm" label="✓" />
                {post.hostNote}
              </p>
            ) : null}
          </section>

          <section className="glass rounded-[28px] p-6 lg:col-span-5">
            <h2 className="text-lg font-bold">Who&apos;s interested</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              <strong className="text-ink">{post.responses} students</strong> have answered this
              invite. Everyone stays masked until the day itself.
            </p>
            <ul className="mt-4 space-y-2">
              {(post.interestedFrom ?? []).map((u, i) => (
                <li
                  key={`${u}-${i}`}
                  className="flex items-center justify-between rounded-2xl bg-surface/70 px-3 py-2 text-sm"
                >
                  <span className="font-medium">Masked student</span>
                  <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    {UNIVERSITY_SHORT[u]}
                  </span>
                </li>
              ))}
              {post.joined ? (
                <li className="animate-pop flex items-center justify-between rounded-2xl bg-teal/15 px-3 py-2 text-sm">
                  <span className="font-semibold">{profile?.alias ?? "You"} (you)</span>
                  <span className="font-mono text-[10px] tracking-widest text-teal uppercase">
                    {profile ? UNIVERSITY_SHORT[profile.university] : "you"}
                  </span>
                </li>
              ) : null}
            </ul>

            <button
              onClick={() => toggleJoin(post.id)}
              className={`mt-5 w-full rounded-full py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                post.joined ? "bg-teal text-teal-foreground" : "bg-coral text-coral-foreground"
              }`}
            >
              {post.joined ? cta.joined : cta.idle}
            </button>

            {post.joined ? (
              <div className="animate-pop mt-4 rounded-2xl border-2 border-dashed border-teal/50 bg-paper p-4">
                <p className="font-mono text-[10px] tracking-widest text-teal uppercase">
                  Sealed · you are {cta.verb}
                </p>
                <p className="mt-1 text-sm text-pretty">
                  The host gets an anonymous note that one more person is in. Details land in your
                  letter inbox — nobody sees your name.
                </p>
                <Link to="/letters" className="mt-2 inline-block text-sm font-semibold text-plum">
                  Open the letter inbox →
                </Link>
              </div>
            ) : (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Joining is anonymous. You can step back out at any time.
              </p>
            )}
          </section>
        </div>
      </div>
    </MistShell>
  );
}
