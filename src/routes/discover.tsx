import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MistShell } from "@/components/MistShell";
import { useMist, personScore, passesGenderFilter, SEED_PEOPLE, UNIVERSITIES } from "@/lib/mist-store";
import { PURPOSES, PURPOSE_LABEL, slotLabel, type PurposeId } from "@/lib/mist-social";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "People you should meet — Mist" },
      {
        name: "description",
        content:
          "Purpose-first recommendations for UAE students: study partners, project collaborators and coffee chats matched on course, campus, interests and free hours — never on photos.",
      },
      { property: "og:title", content: "People you should meet — Mist" },
      {
        property: "og:description",
        content: "Matched on course, purpose and availability. No photos, no popularity, no ranking by looks.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { profile, blocked, createThread } = useMist();
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState<PurposeId | "all">("all");
  const [campus, setCampus] = useState<string>("All campuses");
  const [onlyOverlap, setOnlyOverlap] = useState(false);

  const ranked = useMemo(() => {
    return SEED_PEOPLE.filter((p) => !blocked.includes(p.alias))
      .filter((p) => passesGenderFilter(profile, p))
      .filter((p) => purpose === "all" || p.purposes.includes(purpose))
      .filter((p) => campus === "All campuses" || p.university === campus)
      .map((p) => ({ person: p, ...personScore(profile, p) }))
      .filter((r) => (onlyOverlap ? r.reasons.some((x) => x.includes("free slot")) : true))
      .sort((a, b) => b.score - a.score);
  }, [profile, blocked, purpose, campus, onlyOverlap]);

  function startChat(alias: string, university: string, sharedInterest: string, p: PurposeId) {
    const thread = createThread({
      mode: "pair",
      duration: "day",
      sharedInterest,
      partner: { alias, university: university as (typeof UNIVERSITIES)[number] },
      purpose: p,
    });
    navigate({ to: "/chat/$threadId", params: { threadId: thread.id } });
  }

  if (!profile) {
    return (
      <MistShell>
        <section className="glass mt-8 rounded-3xl p-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">People you should meet</h1>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Verify your student email first — recommendations only ever contain verified students.
          </p>
          <Link
            to="/join"
            className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-semibold text-background"
          >
            Get verified
          </Link>
        </section>
      </MistShell>
    );
  }

  return (
    <MistShell>
      <section className="mt-6 sm:mt-10">
        <p className="font-mono text-[11px] tracking-widest text-teal uppercase">Recommendations</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
          People you should meet.
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Ranked by <strong className="text-ink">purpose, course, interests and free hours</strong> — never by
          photos or popularity. Everyone here is a verified student, and nobody can see who you are until you
          decide.
        </p>
      </section>

      <div className="glass mt-6 flex flex-col gap-4 rounded-3xl p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          <FilterChip active={purpose === "all"} onClick={() => setPurpose("all")}>
            Any purpose
          </FilterChip>
          {PURPOSES.map((p) => (
            <FilterChip key={p.id} active={purpose === p.id} onClick={() => setPurpose(p.id)}>
              {p.emoji} {p.label}
            </FilterChip>
          ))}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex-1">
            <span className="sr-only">Filter by campus</span>
            <select
              value={campus}
              onChange={(e) => setCampus(e.target.value)}
              className="w-full rounded-2xl border border-line bg-card px-4 py-2.5 text-sm"
            >
              <option>All campuses</option>
              {UNIVERSITIES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={onlyOverlap}
              onChange={(e) => setOnlyOverlap(e.target.checked)}
              className="size-4 accent-teal"
            />
            Only people free when I am
          </label>
          <p className="font-mono text-xs text-muted-foreground">
            {ranked.length} of {SEED_PEOPLE.length} in pool
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {ranked.map(({ person, score, reasons }) => (
          <article key={person.alias} className="glass flex flex-col rounded-3xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{person.alias}</h2>
                <p className="text-sm text-muted-foreground">
                  {person.course} · {person.year} · {person.university}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-mint px-2.5 py-1 font-mono text-[10px] tracking-wide text-ink uppercase">
                ✓ Verified student
              </span>
            </div>

            <p className="mt-3 text-sm">{person.note}</p>

            <ul className="mt-3 flex flex-wrap gap-1.5">
              {person.purposes.map((p) => (
                <li
                  key={p}
                  className="rounded-full bg-ink/5 px-2.5 py-1 font-mono text-[10px] tracking-wide uppercase"
                >
                  {PURPOSE_LABEL[p]}
                </li>
              ))}
            </ul>

            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              Free: {person.slots.map(slotLabel).join(" · ")}
            </p>

            {reasons.length ? (
              <ul className="mt-3 space-y-1 rounded-2xl bg-butter/30 p-3 text-xs">
                {reasons.map((r) => (
                  <li key={r}>◆ {r}</li>
                ))}
              </ul>
            ) : null}

            {person.reputation.length ? (
              <p className="mt-3 text-xs text-muted-foreground">
                ⭐ Rated <strong className="text-ink">{person.reputation.join(", ")}</strong> by past collaborators
              </p>
            ) : null}

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] text-muted-foreground">match {score}</span>
              <button
                type="button"
                onClick={() =>
                  startChat(
                    person.alias,
                    person.university,
                    person.interests[0] ?? person.course,
                    person.purposes[0] ?? "coffee",
                  )
                }
                className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Say hi anonymously
              </button>
            </div>
          </article>
        ))}
      </div>

      {!ranked.length ? (
        <p className="glass mt-6 rounded-3xl p-8 text-center text-muted-foreground">
          Nobody matches those filters yet. Widen the campus or purpose and the pool refills.
        </p>
      ) : null}
    </MistShell>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
        active ? "bg-ink text-background" : "bg-ink/5 hover:bg-ink/10"
      }`}
    >
      {children}
    </button>
  );
}
