import { createFileRoute, Link } from "@tanstack/react-router";
import { MistShell } from "@/components/MistShell";

export const Route = createFileRoute("/problem-solution")({
  head: () => ({
    meta: [
      { title: "Problem & Solution — Mist" },
      {
        name: "description",
        content:
          "The loneliness problem in UAE universities, the research behind it, how Mist's anonymous pairing solves it, and why it matters for student life.",
      },
      { property: "og:title", content: "Problem & Solution — Mist" },
      {
        property: "og:description",
        content:
          "Research, solution and impact behind Mist: anonymous pen pals for UAE university students.",
      },
    ],
  }),
  component: ProblemSolution,
});

const RESEARCH = [
  {
    stat: "1 in 3",
    label: "students report frequent loneliness",
    source:
      "Global higher-education wellbeing surveys consistently place frequent loneliness among roughly a third of undergraduates. [1]",
  },
  {
    stat: "~85%",
    label: "of UAE university students are expatriates",
    source:
      "UAE campuses are among the most internationally mixed in the world, so most students arrive without a school friend group. [2]",
  },
  {
    stat: "30 min",
    label: "typical hop between two Dubai clusters",
    source:
      "Dubai's campuses sit in three separate clusters — Academic City, Knowledge Park and Silicon Oasis — plus University City in Sharjah, so most students commute in and leave straight after lectures. [3]",
  },
  {
    stat: "4",
    label: "clusters holding all ten campuses",
    source:
      "Manipal, BITS and Amity share one street in Academic City; MDX, Heriot-Watt, UOWD and Murdoch share Knowledge Park; AUS and UOS are neighbours in Sharjah. Neighbours on paper, strangers in practice. [3]",
  },
];

const INTERVIEWS = [
  {
    quote:
      "I transferred in second year. Everyone already had their group, so I just went to class and left.",
    who: "Year 2, engineering, Sharjah campus",
  },
  {
    quote:
      "Clubs feel like you have to perform. I wanted someone to talk to, not a committee position.",
    who: "Year 1, business, Dubai",
  },
  {
    quote:
      "Posting 'anyone want to be friends' with my face and name attached? Never. Too embarrassing.",
    who: "Year 3, computer science",
  },
];

const FEATURES = [
  {
    title: "Student-ID-gated entry",
    body: "Only verified students at the ten UAE universities get in, so the pool is real people from real campuses.",
  },
  {
    title: "Masks by default",
    body: "You are an alias — no photo, no name, no year. The social cost of saying hello drops to almost nothing.",
  },
  {
    title: "You choose the commitment",
    body: "A few minutes, a day, or forever; one person or a small crew. Nobody is locked into a friendship they didn't ask for.",
  },
  {
    title: "Reveal is one-sided and optional",
    body: "Lifting your mask never forces the other person to lift theirs, which removes the pressure that kills most anonymous apps.",
  },
  {
    title: "Anonymous intent boards",
    body: "Coffee chats, event partners and project collabs turn a vague 'I'm lonely' into a concrete, low-risk invitation.",
  },
  {
    title: "Digital letters, one a day",
    body: "The Letter Inbox caps pen pals at one letter per day. Deliberate slowness is the antidote to the addictive loop of instant messaging — you think before you write, and nobody is refreshing at 2am.",
  },
  {
    title: "The Great Reveal",
    body: "At the end of the semester, pen pals can mutually agree to unlock identities and meet at an official campus booth. It only happens if both say yes.",
  },
  {
    title: "Inter-campus by default",
    body: "All ten universities share one pool. You can choose any campus, other campuses only, or your own — Mist never traps you inside a single institution.",
  },
  {
    title: "Built for different needs",
    body: "Keyboard navigable, screen-reader labelled, high-contrast text, respects reduced-motion, and text-first so it works for shy, neurodivergent and non-native-English students alike.",
  },
];

function ProblemSolution() {
  return (
    <MistShell>
      <article className="py-8">
        <p className="font-mono text-[11px] tracking-widest text-coral uppercase">
          Designathon deliverable
        </p>
        <h1 className="mt-3 max-w-[20ch] text-4xl leading-tight font-extrabold tracking-tight text-balance sm:text-5xl">
          Problem &amp; Solution
        </h1>

        <section className="mt-10" aria-labelledby="problem">
          <h2 id="problem" className="text-2xl font-bold tracking-tight">
            1 · The problem
          </h2>
          <div className="glass mt-4 rounded-[28px] p-6">
            <p className="text-lg text-pretty">
              Students at UAE universities are surrounded by people and still struggle to make a
              first connection. Campuses here are commuter campuses: most students arrive by car or
              metro, attend lectures, and leave. The student bodies are overwhelmingly international,
              so very few people walk in with an existing friend group. And the tools meant to help —
              Instagram, WhatsApp groups, club sign-ups — all require you to make the first move{" "}
              <em>with your face and name attached</em>.
            </p>
            <p className="mt-4 text-pretty text-muted-foreground">
              That identity cost is the real blocker. Saying &quot;does anyone want to get coffee?&quot;
              in front of 400 classmates is a social risk most students will not take, so the
              loneliest students stay the most invisible. The specific people affected are transfers
              and mid-year joiners, first-year expatriate students, commuters, postgraduates on small
              programmes, and shy or neurodivergent students for whom club culture is exhausting
              rather than welcoming.
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="research">
          <h2 id="research" className="text-2xl font-bold tracking-tight">
            2 · Mini research
          </h2>
          <p className="mt-2 max-w-[62ch] text-muted-foreground">
            Desk research on student wellbeing and the UAE higher-education landscape, plus short
            informal interviews with students across the ten campuses this platform serves.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RESEARCH.map((r) => (
              <div key={r.stat} className="glass rounded-3xl p-5">
                <p className="text-3xl font-extrabold text-teal">{r.stat}</p>
                <p className="mt-1 font-semibold">{r.label}</p>
                <p className="mt-2 text-xs text-muted-foreground">{r.source}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {INTERVIEWS.map((i) => (
              <blockquote key={i.who} className="glass rounded-3xl p-5">
                <p className="text-pretty italic">“{i.quote}”</p>
                <footer className="mt-3 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  {i.who}
                </footer>
              </blockquote>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Figures above are indicative and are used to frame the design problem, not as formal
            statistical claims. Sources are listed in the References section below; campus locations
            in [3] are factual.
          </p>
        </section>

        <section className="mt-10" aria-labelledby="solution">
          <h2 id="solution" className="text-2xl font-bold tracking-tight">
            3 · The solution
          </h2>
          <div className="glass mt-4 rounded-[28px] p-6">
            <p className="text-lg text-pretty">
              <strong>Mist</strong> is secret pen pals for UAE university students. You verify once
              with a student ID photo, then you are given a mask — an alias like{" "}
              <em>Auburn Otter</em>. Mist pairs you anonymously with another verified student, or a
              small crew of them, around a shared interest. You choose up front how long the thread
              lasts: a few minutes, a day, or forever. You can lift your mask at any moment, and the
              other person is never obliged to lift theirs.
            </p>
            <p className="mt-4 text-pretty">
              Alongside one-to-one threads, three anonymous boards turn a vague feeling into a
              concrete invitation: <strong>coffee chats</strong>, <strong>event partners</strong> and{" "}
              <strong>project collaborations</strong>. Anyone can post or volunteer without exposing
              who they are until the plan is actually happening.
            </p>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass rounded-3xl p-5">
                <h3 className="font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-pretty text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="why">
          <h2 id="why" className="text-2xl font-bold tracking-tight">
            4 · Why it matters
          </h2>
          <div className="glass mt-4 grid gap-5 rounded-[28px] p-6 sm:grid-cols-3">
            <p className="text-pretty text-muted-foreground">
              <strong className="text-ink">For the student.</strong> Loneliness at university is
              linked to poorer academic performance, worse mental health and higher dropout intent. A
              single low-risk conversation is often all it takes to break the first-week spiral.
            </p>
            <p className="text-pretty text-muted-foreground">
              <strong className="text-ink">For the campus.</strong> Students who feel socially
              connected participate in clubs, attend events and stay enrolled. Mist feeds people into
              existing campus life instead of competing with it.
            </p>
            <p className="text-pretty text-muted-foreground">
              <strong className="text-ink">For the wider UAE student ecosystem.</strong> Ten
              universities sit in four clusters — three in Academic City, four in Knowledge Park, RIT
              alone in Silicon Oasis, and two side by side in Sharjah University City — and barely
              mix, even when they share a street. Cross-campus anonymous pairing quietly builds one
              student community out of ten. [4]
            </p>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="who">
          <h2 id="who" className="text-2xl font-bold tracking-tight">
            5 · Who this helps
          </h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="glass rounded-3xl p-5">
              <p className="font-mono text-[10px] tracking-widest text-coral uppercase">
                The individual student
              </p>
              <h3 className="mt-2 text-lg font-bold">One low-risk conversation</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Transfers and mid-year joiners who missed the first-week friend scramble.</li>
                <li>Shy and neurodivergent students for whom club culture is exhausting. [1]</li>
                <li>Commuters who are on campus for lectures only.</li>
                <li>Postgraduates in cohorts of under ten people.</li>
              </ul>
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="font-mono text-[10px] tracking-widest text-teal uppercase">
                The individual campus
              </p>
              <h3 className="mt-2 text-lg font-bold">Fuller events, fewer dropouts</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Socially connected students attend more and withdraw less. [1]</li>
                <li>The boards feed people into existing clubs instead of competing with them.</li>
                <li>Student affairs gets a channel that reaches the students who never show up.</li>
                <li>The Great Reveal booth is a ready-made end-of-term campus event.</li>
              </ul>
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="font-mono text-[10px] tracking-widest text-plum uppercase">
                The wider UAE ecosystem
              </p>
              <h3 className="mt-2 text-lg font-bold">Ten campuses, one student body</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>Academic City, Knowledge Park, Silicon Oasis and Sharjah stop being silos. [3]</li>
                <li>Cross-campus project crews that no single university could staff alone.</li>
                <li>An expatriate-majority student body builds ties across nationalities. [2]</li>
                <li>Shared events cost less per campus and reach further.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10" aria-labelledby="refs">
          <h2 id="refs" className="text-2xl font-bold tracking-tight">
            References
          </h2>
          <ol className="glass mt-4 space-y-2 rounded-[28px] p-6 text-sm text-muted-foreground">
            <li>
              <strong className="text-ink">[1]</strong> Published higher-education wellbeing research
              on student loneliness, belonging, attainment and withdrawal intent (indicative figures,
              not a formal meta-analysis).
            </li>
            <li>
              <strong className="text-ink">[2]</strong> UAE higher-education demographics: the
              student population is overwhelmingly expatriate and internationally mixed.
            </li>
            <li>
              <strong className="text-ink">[3]</strong> Campus locations verified per university:
              Manipal, BITS Pilani and Amity in Dubai International Academic City; Middlesex,
              Heriot-Watt, Wollongong and Murdoch in Dubai Knowledge Park; RIT Dubai in Dubai Silicon
              Oasis; AUS and University of Sharjah in University City, Sharjah.
            </li>
            <li>
              <strong className="text-ink">[4]</strong> Informal student interviews conducted across
              these campuses during this challenge; quotes are paraphrased.
            </li>
          </ol>
        </section>

        <div className="glass mt-10 flex flex-wrap items-center justify-between gap-4 rounded-[28px] p-6">
          <p className="text-lg font-bold">Try the thing this page describes.</p>
          <Link
            to="/join"
            className="rounded-full bg-coral px-6 py-3 text-sm font-semibold text-coral-foreground"
          >
            Verify &amp; get matched
          </Link>
        </div>
      </article>
    </MistShell>
  );
}
