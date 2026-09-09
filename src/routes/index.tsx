import { createFileRoute, Link } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";
import { CampusOrbit } from "@/components/CampusOrbit";
import { PostageStamp } from "@/components/Postal";
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

function Index() {
  const { profile, penPal, letters, threads } = useMist();
  const { posts } = useMist();
  const unread = letters.filter((l) => !l.fromMe && !l.read).length;
  const activeCampuses = Array.from(
    new Set([
      ...(penPal ? [penPal.university] : []),
      ...threads.flatMap((t) => t.members.filter((m) => !m.isMe).map((m) => m.university)),
      ...posts.filter((p) => p.joined).map((p) => p.university),
    ]),
  );

  return (
    <MistShell>
      {/* Hero */}
      <section className="grid items-center gap-8 pt-4 pb-10 sm:pt-8 lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-7">
          <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-line bg-card px-3 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            <span className="size-1.5 animate-pulse rounded-full bg-coral" />
            Verified students · 10 UAE campuses
          </span>
          <h1 className="mt-5 animate-rise text-[2.75rem] leading-[0.92] font-extrabold tracking-tight text-balance sm:text-6xl xl:text-7xl">
            Ten campuses.
            <br />
            <span className="font-serif font-normal italic">One letter a day.</span>
            <br />
            <span className="text-gradient">No names attached.</span>
          </h1>
          <p className="mt-5 max-w-[46ch] animate-rise text-base text-pretty text-muted-foreground sm:text-lg">
            Mist is secret pen pals for verified UAE students. Write slowly, stay masked, and
            reveal only if you both decide to.
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
              Quick masked chat
            </Link>
          </div>
          <Link
            to={profile ? "/letters" : "/join"}
            className="glass mt-6 flex animate-rise items-center gap-4 rounded-3xl p-4 transition-transform hover:-translate-y-1"
          >
            <PostageStamp glyph="🎭" caption="10 Dec" tint="bg-coral/25" />
            <span className="min-w-0">
              <span className="block font-mono text-[10px] tracking-widest text-coral uppercase">
                The Great Reveal · {GREAT_REVEAL_EVENT.date}
              </span>
              <span className="mt-0.5 block font-serif text-xl leading-snug">
                A term of letters, then you both decide whether to meet.
              </span>
              <span className="block text-xs text-muted-foreground">
                {GREAT_REVEAL_EVENT.venue} · only happens if you both say yes
              </span>
            </span>
          </Link>

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

      {/* Dashboard strip for verified students */}
      {profile ? (
        <section
          aria-label="Your Mist today"
          className="grid gap-3 rounded-[28px] bg-ink p-4 text-background sm:grid-cols-3 sm:p-5"
        >
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
          <Link to="/letters" className="rounded-2xl bg-background/10 p-4 transition-colors hover:bg-background/15">
            <p className="font-mono text-[10px] tracking-widest text-coral uppercase">Great Reveal</p>
            <p className="mt-1 text-2xl font-extrabold">
              {penPal?.greatReveal.agreedAt ? "Agreed ✓" : "10 Dec"}
            </p>
            <p className="text-xs text-background/60">{GREAT_REVEAL_EVENT.venue}</p>
          </Link>

          <div className="rounded-2xl bg-background/10 p-4 sm:col-span-3">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_300px] sm:items-center">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-lilac uppercase">
                  Your campus orbit
                </p>
                <p className="mt-1 text-2xl font-extrabold">
                  {activeCampuses.length} of 10{" "}
                  <span className="text-base font-medium text-background/70">campuses reached</span>
                </p>
                <p className="mt-1 max-w-[46ch] text-xs text-background/60">
                  Every campus you write to, chat with or answer an invite from is pulled closer to
                  the centre. Your pen pal&apos;s campus is the coral one.
                </p>
              </div>
              <div className="text-background">
                <CampusOrbit
                  home={profile.university}
                  activeCampuses={activeCampuses}
                  penPalCampus={penPal?.university ?? null}
                  letters={letters.length}
                  threads={threads.length}
                />
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
              1:1 or a crew of four. A timer you both control.
            </p>
            <p className="mt-5 font-mono text-4xl font-medium tabular-nums">03:12</p>
          </Link>

          <Link
            to="/boards"
            className="rounded-[28px] bg-butter p-6 text-butter-foreground transition-transform hover:-translate-y-1 md:col-span-2"
          >
            <div className="text-2xl">☕</div>
            <h3 className="mt-3 text-xl font-extrabold">Coffee chats</h3>
            <p className="mt-1 text-sm opacity-80">Ten-minute invites, any campus.</p>
          </Link>
          <Link
            to="/boards"
            className="rounded-[28px] bg-mint p-6 transition-transform hover:-translate-y-1 md:col-span-2"
          >
            <div className="text-2xl">✦</div>
            <h3 className="mt-3 text-xl font-extrabold">Event partners</h3>
            <p className="mt-1 text-sm text-muted-foreground">Never show up alone again.</p>
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
            <li
              key={s.n}
              className={`rounded-3xl p-5 ${s.tint} ${i % 2 ? "sm:translate-y-3" : ""}`}
            >
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
