import { createFileRoute, Link } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";
import { UNIVERSITIES, useMist } from "@/lib/mist-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mist — Secret pen pals for UAE university students" },
      {
        name: "description",
        content:
          "Verified students at RIT, MDX, AUS, Heriot-Watt and Wollongong pair anonymously, chat for minutes, a day or forever, and reveal only when ready.",
      },
      { property: "og:title", content: "Mist — Secret pen pals for UAE university students" },
      {
        property: "og:description",
        content:
          "Anonymous pairing, coffee chats, event partners and project collabs — exclusively for UAE university students.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    n: "01",
    title: "Verify with your student ID",
    body: "Upload a photo of your university ID. It is checked once, stored on your device, and never shown to anyone you talk to.",
  },
  {
    n: "02",
    title: "Choose your shape and your clock",
    body: "One-to-one or a small crew. A few minutes, a day, or forever. You decide before you're matched.",
  },
  {
    n: "03",
    title: "Talk as a mask",
    body: "You get an alias like Auburn Otter. No photo, no name, no year — just what you actually want to say.",
  },
  {
    n: "04",
    title: "Reveal on your terms",
    body: "Lift your mask whenever you like. The other person is never forced to lift theirs.",
  },
];

function Index() {
  const { profile } = useMist();

  return (
    <MistShell>
      <section className="grid items-center gap-10 pt-6 pb-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="inline-flex animate-rise items-center gap-2 rounded-full border border-line bg-ink/5 px-3 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            <span className="size-1.5 rounded-full bg-coral" /> Anonymous pairing, made for campus
          </span>
          <h1 className="mt-5 animate-rise text-5xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-6xl xl:text-7xl">
            Secret pen pals, <br /> but it&apos;s <span className="text-teal">your campus.</span>
          </h1>
          <p className="mt-5 max-w-[42ch] animate-rise text-lg text-pretty text-muted-foreground">
            Pair with one student or a whole group, stay blurred, and text for a few minutes, a day,
            or forever. Reveal yourself only when you&apos;re ready.
          </p>
          <div className="mt-7 flex animate-rise flex-wrap items-center gap-3">
            <Link
              to={profile ? "/match" : "/join"}
              className="rounded-full bg-coral px-6 py-3 font-semibold text-coral-foreground transition-transform hover:-translate-y-0.5"
            >
              {profile ? "Find a match" : "Start anonymously"}
            </Link>
            <span className="rounded-full border border-line bg-card px-4 py-3 text-sm font-medium text-muted-foreground">
              Verified RIT · MDX · AUS · Heriot-Watt · Wollongong
            </span>
          </div>
        </div>

        <div className="relative lg:col-span-5">
          <div className="glass animate-rise rounded-[32px] p-5 shadow-[0_30px_60px_-30px_oklch(0.262_0.038_210/0.35)] ring-1 ring-black/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="grid size-12 place-items-center overflow-hidden rounded-full bg-surface"
                >
                  <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                    ???
                  </span>
                </div>
                <div>
                  <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    Your match
                  </p>
                  <p className="text-lg font-bold">Auburn Otter · RIT</p>
                </div>
              </div>
              <span className="font-mono text-[11px] text-coral">03:12 left</span>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="max-w-[80%] rounded-2xl rounded-tl-md bg-ink/5 px-4 py-2.5">
                hey stranger, what brings you to design week?
              </div>
              <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-md bg-teal px-4 py-2.5 text-teal-foreground">
                same question lol. reveal or keep me guessing?
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Link
                to={profile ? "/match" : "/join"}
                className="flex-1 rounded-full bg-coral py-2.5 text-center text-sm font-semibold text-coral-foreground"
              >
                Try it yourself
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="animate-rise overflow-hidden border-y border-line py-3">
        <div className="flex animate-marq gap-10 font-mono text-xs tracking-widest whitespace-nowrap text-muted-foreground uppercase">
          {[...UNIVERSITIES, ...UNIVERSITIES].map((u, i) => (
            <span key={`${u}-${i}`}>{u}</span>
          ))}
        </div>
      </div>

      <section className="py-12" aria-labelledby="how">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase">How it works</p>
        <h2 id="how" className="text-2xl font-bold tracking-tight">
          Four steps, no awkward small talk
        </h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="glass rounded-3xl p-5">
              <span className="font-mono text-xs tracking-widest text-teal">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold">{s.title}</h3>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="py-6" aria-labelledby="boards-heading">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-widest text-coral uppercase">The boards</p>
            <h2 id="boards-heading" className="text-2xl font-bold tracking-tight">
              Anonymous ways to say hi
            </h2>
          </div>
          <Link to="/boards" className="hidden text-sm font-semibold text-teal sm:block">
            Open the boards →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="glass rounded-3xl p-5 transition-transform hover:-translate-y-1">
            <div className="grid size-11 place-items-center rounded-2xl bg-coral/15 text-lg">☕</div>
            <h3 className="mt-4 text-lg font-bold">Coffee chats</h3>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              Invite for a ten-minute catch-up. No pressure, just steam.
            </p>
          </div>
          <div className="glass rounded-3xl p-5 transition-transform hover:-translate-y-1">
            <div className="grid size-11 place-items-center rounded-2xl bg-teal/15 text-lg text-teal">
              ✦
            </div>
            <h3 className="mt-4 text-lg font-bold">Event partners</h3>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              Find someone to split the table with at the next inter-uni social.
            </p>
          </div>
          <div className="glass rounded-3xl p-5 transition-transform hover:-translate-y-1">
            <div className="grid size-11 place-items-center rounded-2xl bg-aqua/25 text-lg">◎</div>
            <h3 className="mt-4 text-lg font-bold">Project collabs</h3>
            <p className="mt-1 text-sm text-pretty text-muted-foreground">
              Volunteer for a build. Reveal names when you commit.
            </p>
          </div>
        </div>
      </section>

      <section className="glass my-6 rounded-[32px] p-6 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight">Safety is part of the design</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <p className="text-sm text-muted-foreground">
            <strong className="text-ink">Students only.</strong> Every account is gated behind a
            student ID photo from one of five UAE universities.
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
