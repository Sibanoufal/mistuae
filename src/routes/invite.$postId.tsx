import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";
import { BOARD_META, UNIVERSITY_SHORT, useMist } from "@/lib/mist-store";

export const Route = createFileRoute("/invite/$postId")({
  head: () => ({
    meta: [
      { title: "Anonymous invite details — Mist" },
      {
        name: "description",
        content:
          "The full plan behind an anonymous Mist invite: who posted it, where it happens, how many students are in, and what happens next.",
      },
      { property: "og:title", content: "Anonymous invite details — Mist" },
      {
        property: "og:description",
        content: "See the plan, the campus and the masked host before you commit.",
      },
    ],
  }),
  component: InviteDetail,
});

const NEXT_STEPS: Record<string, string[]> = {
  coffee: [
    "Your mask is shared with the host — never your name or ID.",
    "The host confirms the exact table, usually the day before.",
    "Ten minutes is the promise. Staying longer is entirely optional.",
  ],
  event: [
    "The host sees only your alias and campus.",
    "You get the meeting point one hour before doors.",
    "Either of you can pull out, no explanation required.",
  ],
  project: [
    "Send a two-line pitch — the host picks from masked pitches only.",
    "Crews agree scope and deadline before any names are exchanged.",
    "Reveal happens when you decide to, or never.",
  ],
};

function InviteDetail() {
  const { postId } = useParams({ from: "/invite/$postId" });
  const { posts, toggleJoin, profile } = useMist();
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return (
      <MistShell>
        <div className="glass mx-auto my-16 max-w-md rounded-[32px] p-8 text-center">
          <h1 className="text-2xl font-extrabold">This invite has closed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            It may have filled up or been withdrawn by the host.
          </p>
          <Link
            to="/boards"
            className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background"
          >
            Back to the boards
          </Link>
        </div>
      </MistShell>
    );
  }

  const meta = BOARD_META[post.kind];
  const steps = NEXT_STEPS[post.kind]!;

  return (
    <MistShell>
      <div className="py-8">
        <Link to="/boards" className="font-mono text-[11px] tracking-widest text-teal uppercase">
          ← All invites
        </Link>

        <div className="mt-4 grid gap-5 lg:grid-cols-12">
          <article className="paper relative rounded-[28px] p-6 sm:p-9 lg:col-span-8">
            <span
              aria-hidden="true"
              className="absolute top-5 right-5 grid size-14 rotate-12 place-items-center rounded-full border-2 border-dashed border-coral/60 text-center font-mono text-[8px] leading-tight tracking-widest text-coral uppercase"
            >
              Post
              <br />
              marked
            </span>
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${meta.chip}`}>
              {meta.icon} {meta.label}
            </span>
            <h1 className="mt-3 max-w-[24ch] pr-16 font-serif text-3xl leading-tight text-balance sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 max-w-[60ch] font-serif text-lg leading-7 text-pretty">{post.body}</p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-ink/5 p-3">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  When
                </dt>
                <dd className="mt-0.5 text-sm font-semibold">{post.when}</dd>
              </div>
              <div className="rounded-2xl bg-ink/5 p-3">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Campus
                </dt>
                <dd className="mt-0.5 text-sm font-semibold">{post.university}</dd>
              </div>
              <div className="rounded-2xl bg-ink/5 p-3">
                <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Vibe
                </dt>
                <dd className="mt-0.5 text-sm font-semibold">{post.vibe ?? "Unlabelled"}</dd>
              </div>
            </dl>

            <h2 className="mt-8 text-lg font-bold">What happens if you join</h2>
            <ol className="mt-3 space-y-2">
              {steps.map((s, i) => (
                <li key={s} className="flex gap-3 rounded-2xl bg-background/60 p-3 text-sm">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-coral font-mono text-[10px] text-coral-foreground">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{s}</span>
                </li>
              ))}
            </ol>
          </article>

          <aside className="lg:col-span-4">
            <div className="glass rounded-[28px] p-5">
              <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                Masked host
              </p>
              <p className="mt-1 text-2xl font-extrabold text-teal">{post.alias}</p>
              <p className="text-sm text-muted-foreground">
                {post.hostYear ? `${post.hostYear} · ` : ""}
                {UNIVERSITY_SHORT[post.university]}
              </p>

              <div className="mt-5 rounded-2xl bg-ink/5 p-4">
                <p className="text-3xl font-extrabold">{post.responses}</p>
                <p className="text-xs text-muted-foreground">{meta.unit}</p>
                {post.spots ? (
                  <p className="mt-2 font-mono text-[10px] tracking-widest text-coral uppercase">
                    {post.spots} spot{post.spots > 1 ? "s" : ""} left
                  </p>
                ) : null}
              </div>

              <button
                onClick={() => toggleJoin(post.id)}
                className={`mt-5 w-full rounded-full px-4 py-3 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
                  post.joined ? "bg-teal text-teal-foreground" : "bg-coral text-coral-foreground"
                }`}
              >
                {post.joined ? meta.joinedCta : meta.cta}
              </button>

              {post.joined ? (
                <div className="animate-pop mt-4 rounded-2xl border-2 border-dashed border-teal/50 p-4 text-center">
                  <span className="grid size-10 mx-auto place-items-center rounded-full bg-teal font-mono text-xs text-teal-foreground animate-seal">
                    ✓
                  </span>
                  <p className="mt-2 text-sm font-semibold">
                    You&apos;re in as {profile?.alias ?? "a masked student"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {post.alias} sees your mask only. Details land in your letters.
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {meta.blurb}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </MistShell>
  );
}
