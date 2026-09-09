import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { MistShell } from "@/components/MistShell";
import {
  GREAT_REVEAL_EVENT,
  UNIVERSITIES,
  UNIVERSITY_SHORT,
  useMist,
} from "@/lib/mist-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mist — Anonymous pen pals across 10 UAE universities" },
      {
        name: "description",
        content:
          "Verified students at RIT, MDX, AUS, Heriot-Watt, UOWD, Manipal, BITS, Murdoch, UOS and Amity pair anonymously, write one letter a day, and reveal only when both are ready.",
      },
      { property: "og:title", content: "Mist — Anonymous pen pals across 10 UAE universities" },
      {
        property: "og:description",
        content:
          "Slow letters, masked chats, coffee invites and an end-of-semester Great Reveal — for UAE university students only.",
      },
    ],
  }),
  component: Index,
});

const CHIP_COLORS = [
  "bg-teal/15 text-teal",
  "bg-coral/15 text-coral",
  "bg-lilac/25 text-plum",
  "bg-butter text-butter-foreground",
  "bg-mint text-ink",
];

const STEPS = [
  {
    n: "01",
    title: "Stamp your ID",
    body: "One photo of your student ID. Checked once, kept on your device, never shown to a match.",
    tint: "bg-butter",
  },
  {
    n: "02",
    title: "Pick any campus",
    body: "Same uni, a different one, or all ten. Cross-campus is the default, not the exception.",
    tint: "bg-mint",
  },
  {
    n: "03",
    title: "Write, don't scroll",
    body: "Daily letters to a pen pal, or a quick masked chat that lasts minutes, a day, or forever.",
    tint: "bg-lilac/30",
  },
  {
    n: "04",
    title: "Reveal together",
    body: "Lift your mask whenever — or wait for the Great Reveal booth at the end of term.",
    tint: "bg-coral/20",
  },
];

function EnvelopeStack() {
  return (
    <div aria-hidden="true" className="relative mx-auto h-[300px] w-full max-w-[420px] sm:h-[360px]">
      <div className="absolute top-14 left-3 h-44 w-[86%] -rotate-6 rounded-2xl border border-paper-line bg-gradient-to-br from-lilac/40 to-paper shadow-[0_24px_40px_-24px_oklch(0.262_0.038_210/0.5)] sm:h-52" />
      <div className="absolute top-8 left-8 h-44 w-[86%] rotate-3 rounded-2xl border border-paper-line bg-gradient-to-br from-butter to-paper shadow-[0_24px_40px_-24px_oklch(0.262_0.038_210/0.5)] sm:h-52" />
      <div className="animate-floaty absolute top-2 left-5 h-48 w-[88%] -rotate-1 overflow-hidden rounded-2xl border border-paper-line bg-gradient-to-br from-teal/25 to-paper shadow-[0_30px_50px_-24px_oklch(0.262_0.038_210/0.55)] sm:h-56">
        <div className="absolute inset-x-0 top-0 h-24 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-ink/5" />
        <span className="animate-seal absolute top-16 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-coral font-mono text-sm text-coral-foreground sticker [animation-delay:600ms]">
          M
        </span>
        <div className="absolute bottom-5 left-6 space-y-1.5">
          <p className="font-serif text-xl">To: Auburn Otter</p>
          <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            BITS Pilani Dubai → AUS
          </p>
        </div>
        <span className="absolute top-4 right-4 rotate-6 rounded border-2 border-dashed border-coral/50 px-2 py-1 font-mono text-[9px] tracking-widest text-coral uppercase">
          1 letter / day
        </span>
      </div>

      <div className="animate-pop absolute -bottom-2 right-0 max-w-[230px] rounded-2xl rounded-br-sm bg-ink p-3 text-sm text-background shadow-xl [animation-delay:900ms] sm:right-2">
        <p className="font-mono text-[9px] tracking-widest text-butter uppercase">Masked chat · 03:12</p>
        <p className="mt-1">same question lol. reveal or keep me guessing?</p>
      </div>
      <div className="animate-pop absolute -left-2 bottom-12 rotate-[-8deg] rounded-full bg-butter px-3 py-1.5 font-mono text-[10px] tracking-widest text-butter-foreground uppercase sticker [animation-delay:1200ms] sm:left-0">
        10 campuses
      </div>
    </div>
  );
}

type OrbitNode = {
  id: string;
  label: string;
  sub: string;
  ring: number;
  angle: number;
  tint: string;
};

function Orbit({ nodes }: { nodes: OrbitNode[] }) {
  const size = 300;
  const c = size / 2;
  const radii = [58, 96, 132];
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto h-[300px] w-full max-w-[320px]"
      role="img"
      aria-label={`Your connection orbit: ${nodes.length} active connections`}
    >
      {radii.map((r) => (
        <circle
          key={r}
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeDasharray="3 6"
          className="text-background/25"
        />
      ))}
      {nodes.map((n) => {
        const r = radii[n.ring] ?? 132;
        const x = c + r * Math.cos(n.angle);
        const y = c + r * Math.sin(n.angle);
        return (
          <g key={n.id}>
            <line x1={c} y1={c} x2={x} y2={y} stroke="currentColor" className="text-background/20" />
            <circle cx={x} cy={y} r={12} className={n.tint} />
            <text
              x={x}
              y={y + 26}
              textAnchor="middle"
              className="fill-current text-[8px] text-background/80"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
      <circle cx={c} cy={c} r={22} className="fill-butter" />
      <text
        x={c}
        y={c + 4}
        textAnchor="middle"
        className="fill-ink text-[10px] font-bold"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        YOU
      </text>
    </svg>
  );
}

function Index() {
  const { profile, penPal, letters, threads, posts } = useMist();
  const unread = letters.filter((l) => !l.fromMe && !l.read).length;
  const joined = posts.filter((p) => p.joined);

  const nodes = useMemo<OrbitNode[]>(() => {
    const list: OrbitNode[] = [];
    if (penPal) {
      list.push({
        id: "penpal",
        label: penPal.alias.split(" ")[0]!,
        sub: "Pen pal",
        ring: 0,
        angle: -Math.PI / 2,
        tint: "fill-coral",
      });
    }
    threads
      .filter((t) => !t.closed)
      .slice(0, 5)
      .forEach((t, i, arr) => {
        list.push({
          id: t.id,
          label: (t.members.find((m) => !m.isMe)?.alias ?? "?").split(" ")[0]!,
          sub: "Masked chat",
          ring: 1,
          angle: (i / Math.max(1, arr.length)) * Math.PI * 2 + 0.4,
          tint: "fill-teal",
        });
      });
    joined.slice(0, 6).forEach((p, i, arr) => {
      list.push({
        id: p.id,
        label: UNIVERSITY_SHORT[p.university],
        sub: "Invite",
        ring: 2,
        angle: (i / Math.max(1, arr.length)) * Math.PI * 2 + 1.1,
        tint: "fill-lilac",
      });
    });
    return list;
  }, [penPal, threads, joined]);

  const timeline = useMemo(() => {
    const items: { id: string; at: number; text: string; seal: string }[] = [];
    letters.slice(0, 6).forEach((l) =>
      items.push({
        id: `l-${l.id}`,
        at: l.sentAt,
        text: l.fromMe ? `You posted “${l.subject}”` : `Letter arrived: “${l.subject}”`,
        seal: l.fromMe ? "bg-coral" : "bg-lilac",
      }),
    );
    threads.slice(0, 4).forEach((t) =>
      items.push({
        id: `t-${t.id}`,
        at: t.createdAt,
        text: `Masked thread opened with ${t.members.find((m) => !m.isMe)?.alias ?? "a stranger"}`,
        seal: "bg-teal",
      }),
    );
    joined.slice(0, 4).forEach((p) =>
      items.push({
        id: `p-${p.id}`,
        at: Date.now() - 1000,
        text: `You joined “${p.title}”`,
        seal: "bg-butter",
      }),
    );
    return items.sort((a, b) => b.at - a.at).slice(0, 6);
  }, [letters, threads, joined]);

  return (
    <MistShell>
      {/* Hero */}
      <section className="grid items-center gap-8 pt-4 pb-10 sm:pt-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-line bg-card px-3 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            <span className="size-1.5 animate-pulse rounded-full bg-coral" />
            Verified students · 10 UAE campuses
          </span>
          <h1 className="mt-5 animate-rise text-[2.75rem] leading-[0.9] font-extrabold tracking-tight text-balance sm:text-6xl xl:text-7xl">
            Ten campuses.
            <br />
            <span className="font-serif font-normal italic">One masked stranger.</span>
            <br />
            <span className="text-gradient">One letter a day.</span>
          </h1>
          <p className="mt-5 max-w-[44ch] animate-rise text-base text-pretty text-muted-foreground sm:text-lg">
            No feed. No photos. No names — until you both decide otherwise.
          </p>
          <div className="mt-7 flex animate-rise flex-wrap items-center gap-3">
            <Link
              to={profile ? "/letters" : "/join"}
              className="rounded-full bg-coral px-6 py-3 font-semibold text-coral-foreground transition-transform hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_oklch(0.693_0.152_33/0.7)]"
            >
              {profile ? "Open my letters" : "Start anonymously"}
            </Link>
            <Link
              to="/match"
              className="rounded-full border border-line bg-card px-6 py-3 font-semibold transition-transform hover:-translate-y-0.5"
            >
              Swipe the masked pool
            </Link>
          </div>
          <div className="mt-6 flex animate-rise flex-wrap gap-2">
            {UNIVERSITIES.map((u, i) => (
              <span
                key={u}
                className={`rounded-full px-2.5 py-1 font-mono text-[10px] tracking-wider uppercase ${CHIP_COLORS[i % CHIP_COLORS.length]}`}
              >
                {UNIVERSITY_SHORT[u]}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-rise lg:col-span-5">
          <EnvelopeStack />
        </div>
      </section>

      {/* Great Reveal teaser — surfaced early */}
      <Link
        to={profile ? "/letters" : "/join"}
        className="group relative flex flex-wrap items-center gap-4 overflow-hidden rounded-[28px] border-2 border-dashed border-coral/50 bg-gradient-to-r from-butter/70 via-paper to-lilac/30 p-5 transition-transform hover:-translate-y-1 sm:gap-6 sm:p-6"
      >
        <span className="animate-seal grid size-14 shrink-0 place-items-center rounded-full bg-coral font-mono text-xs text-coral-foreground sticker">
          10
          <br />
          DEC
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] tracking-widest text-coral uppercase">
            Save the date · optional, mutual
          </p>
          <h2 className="mt-1 font-serif text-2xl leading-tight sm:text-3xl">
            The Great Reveal — one evening, every mask comes off.
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {GREAT_REVEAL_EVENT.date} · {GREAT_REVEAL_EVENT.venue}
          </p>
        </div>
        <span className="font-mono text-[11px] tracking-widest text-plum uppercase group-hover:underline">
          How it works →
        </span>
      </Link>

      {/* Dashboard for verified students */}
      {profile ? (
        <section
          aria-label="Your Mist today"
          className="mt-6 grid gap-5 rounded-[28px] bg-ink p-5 text-background lg:grid-cols-12"
        >
          <div className="grid gap-3 lg:col-span-7 sm:grid-cols-3">
            <Link to="/letters" className="rounded-2xl bg-background/10 p-4 transition-colors hover:bg-background/15">
              <p className="font-mono text-[10px] tracking-widest text-butter uppercase">Letters</p>
              <p className="mt-1 text-2xl font-extrabold">
                {unread} <span className="text-base font-medium text-background/70">unread</span>
              </p>
              <p className="text-xs text-background/60">
                {penPal ? `from ${penPal.alias} · ${UNIVERSITY_SHORT[penPal.university]}` : "Pen pal being assigned"}
              </p>
            </Link>
            <Link to="/threads" className="rounded-2xl bg-background/10 p-4 transition-colors hover:bg-background/15">
              <p className="font-mono text-[10px] tracking-widest text-mint uppercase">Masked chats</p>
              <p className="mt-1 text-2xl font-extrabold">
                {threads.filter((t) => !t.closed).length}{" "}
                <span className="text-base font-medium text-background/70">open</span>
              </p>
              <p className="text-xs text-background/60">You are {profile.alias}</p>
            </Link>
            <Link to="/boards" className="rounded-2xl bg-background/10 p-4 transition-colors hover:bg-background/15">
              <p className="font-mono text-[10px] tracking-widest text-coral uppercase">Invites</p>
              <p className="mt-1 text-2xl font-extrabold">
                {joined.length} <span className="text-base font-medium text-background/70">joined</span>
              </p>
              <p className="text-xs text-background/60">Coffee, events, projects</p>
            </Link>

            {/* Wax-seal activity timeline */}
            <div className="rounded-2xl bg-background/10 p-4 sm:col-span-3">
              <p className="font-mono text-[10px] tracking-widest text-butter uppercase">
                Sealed activity
              </p>
              <ol className="mt-3 space-y-2.5">
                {timeline.length ? (
                  timeline.map((t) => (
                    <li key={t.id} className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full font-mono text-[7px] text-ink ${t.seal}`}
                      >
                        M
                      </span>
                      <span className="min-w-0 flex-1 truncate text-sm text-background/80">
                        {t.text}
                      </span>
                      <span className="shrink-0 font-mono text-[10px] text-background/50">
                        {new Date(t.at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-background/60">
                    Nothing sealed yet — post your first letter.
                  </li>
                )}
              </ol>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-background/10 p-4">
              <p className="font-mono text-[10px] tracking-widest text-mint uppercase">
                Your orbit · computed live
              </p>
              <Orbit nodes={nodes} />
              <div className="mt-2 flex flex-wrap justify-center gap-3 font-mono text-[10px] text-background/70 uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-coral" /> pen pal
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-teal" /> chats
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-lilac" /> invites
                </span>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Marquee */}
      <div className="animate-rise mt-8 overflow-hidden rounded-full border border-line bg-card py-3">
        <div className="flex animate-marq gap-10 font-mono text-xs tracking-widest whitespace-nowrap text-muted-foreground uppercase">
          {[...UNIVERSITIES, ...UNIVERSITIES].map((u, i) => (
            <span key={`${u}-${i}`} className="flex items-center gap-10">
              {u}
              <span className="size-1.5 rounded-full bg-coral" />
            </span>
          ))}
        </div>
      </div>

      {/* Bento */}
      <section className="py-12" aria-labelledby="ways">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase">Three speeds</p>
        <h2 id="ways" className="max-w-[24ch] text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">
          Pick how fast you want to <span className="font-serif font-normal italic">get to know</span>{" "}
          someone.
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-6">
          <Link
            to={profile ? "/letters" : "/join"}
            className="paper group relative overflow-hidden rounded-[28px] p-6 transition-transform hover:-translate-y-1 md:col-span-4"
          >
            <span className="absolute top-5 right-5 grid size-10 rotate-12 place-items-center rounded-full bg-lilac font-mono text-xs text-lilac-foreground sticker transition-transform group-hover:rotate-0">
              M
            </span>
            <p className="font-mono text-[10px] tracking-widest text-plum uppercase">Letter inbox</p>
            <h3 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
              One letter a day. That&apos;s the whole feature.
            </h3>
            <p className="mt-3 max-w-[48ch] text-sm text-pretty text-muted-foreground">
              A vintage-modern envelope inbox. You draft, seal, and post once a day — so you actually
              think about what to say, and nobody is refreshing a chat at 2am.
            </p>
            <span className="mt-4 inline-block text-sm font-semibold text-plum">Open the inbox →</span>
          </Link>

          <Link
            to="/match"
            className="group rounded-[28px] bg-teal p-6 text-teal-foreground transition-transform hover:-translate-y-1 md:col-span-2"
          >
            <p className="font-mono text-[10px] tracking-widest uppercase opacity-80">Masked chat</p>
            <h3 className="mt-2 text-2xl font-extrabold leading-tight">
              Minutes, a day, or forever.
            </h3>
            <p className="mt-2 text-sm opacity-85">
              Drag through the deck. A timer you both control.
            </p>
            <p className="mt-5 font-mono text-4xl font-medium tabular-nums">03:12</p>
          </Link>

          <Link
            to="/boards"
            className="rounded-[28px] bg-butter p-6 text-butter-foreground transition-transform hover:-translate-y-1 md:col-span-2"
          >
            <div className="text-2xl">☕</div>
            <h3 className="mt-3 text-xl font-extrabold">Coffee chats</h3>
            <p className="mt-1 text-sm opacity-80">Karak, ten minutes, no life story required.</p>
          </Link>
          <Link
            to="/boards"
            className="rounded-[28px] bg-mint p-6 transition-transform hover:-translate-y-1 md:col-span-2"
          >
            <div className="text-2xl">✦</div>
            <h3 className="mt-3 text-xl font-extrabold">Event partners</h3>
            <p className="mt-1 text-sm text-muted-foreground">Somebody has a spare ticket tonight.</p>
          </Link>
          <Link
            to="/boards"
            className="rounded-[28px] bg-coral/20 p-6 transition-transform hover:-translate-y-1 md:col-span-2"
          >
            <div className="text-2xl">◎</div>
            <h3 className="mt-3 text-xl font-extrabold">Project collabs</h3>
            <p className="mt-1 text-sm text-muted-foreground">BITS builders meet Murdoch filmmakers.</p>
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="py-6" aria-labelledby="how">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase">How it works</p>
        <h2 id="how" className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Four stamps, no small talk
        </h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.n} className={`rounded-3xl p-5 ${s.tint} ${i % 2 ? "sm:translate-y-3" : ""}`}>
              <span className="inline-block rounded-full bg-background px-2 py-0.5 font-mono text-xs tracking-widest">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-pretty text-ink/70">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Great Reveal */}
      <section
        aria-labelledby="reveal"
        className="relative my-12 overflow-hidden rounded-[32px] bg-ink p-6 text-background sm:p-10"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 size-80 rounded-full bg-lilac/40 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/4 size-72 rounded-full bg-coral/30 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-mono text-[11px] tracking-widest text-butter uppercase">
              End of semester · optional
            </p>
            <h2 id="reveal" className="mt-2 font-serif text-4xl leading-none sm:text-6xl">
              The Great Reveal
            </h2>
            <p className="mt-4 max-w-[56ch] text-pretty text-background/75">
              After a term of letters, pen pals can <strong className="text-background">mutually</strong>{" "}
              unlock their real names and meet at an official booth — {GREAT_REVEAL_EVENT.venue}. If
              only one of you says yes, nothing changes.
            </p>
          </div>
          <div className="lg:col-span-4">
            <Link
              to={profile ? "/letters" : "/join"}
              className="block rounded-3xl border-2 border-dashed border-butter/60 bg-background/10 p-5 transition-colors hover:bg-background/15"
            >
              <p className="font-mono text-[10px] tracking-widest text-butter uppercase">Ticket · admit two</p>
              <p className="mt-1 font-serif text-2xl">{GREAT_REVEAL_EVENT.date}</p>
              <p className="mt-1 text-xs text-background/60">{GREAT_REVEAL_EVENT.note}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-butter">
                {profile ? "Vote with your pen pal →" : "Get verified first →"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="glass rounded-[32px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight">Safety is part of the design</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <p className="text-sm text-muted-foreground">
            <strong className="text-ink">Students only.</strong> Every account is gated behind a
            student ID photo from one of ten UAE universities.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-ink">Nothing leaks.</strong> Your ID and real name stay on your
            device until you personally choose to reveal.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong className="text-ink">You can always leave.</strong> Close a thread at any
            moment; short threads expire on their own.
          </p>
        </div>
      </section>
    </MistShell>
  );
}
