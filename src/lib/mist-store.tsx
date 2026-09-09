import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const UNIVERSITIES = [
  "RIT Dubai",
  "Middlesex University Dubai",
  "American University of Sharjah",
  "Heriot-Watt University Dubai",
  "University of Wollongong in Dubai",
  "Manipal Academy of Higher Education Dubai",
  "BITS Pilani Dubai",
  "Murdoch University Dubai",
  "University of Sharjah",
  "Amity University Dubai",
] as const;

export const UNIVERSITY_SHORT: Record<University, string> = {
  "RIT Dubai": "RIT",
  "Middlesex University Dubai": "MDX",
  "American University of Sharjah": "AUS",
  "Heriot-Watt University Dubai": "Heriot-Watt",
  "University of Wollongong in Dubai": "UOWD",
  "Manipal Academy of Higher Education Dubai": "Manipal",
  "BITS Pilani Dubai": "BITS",
  "Murdoch University Dubai": "Murdoch",
  "University of Sharjah": "UOS",
  "Amity University Dubai": "Amity",
};

export type CampusPref = "any" | "cross" | "same";

export const CAMPUS_PREF_LABEL: Record<CampusPref, { title: string; body: string }> = {
  any: {
    title: "Any campus",
    body: "Mix across all ten UAE universities — the widest pool.",
  },
  cross: {
    title: "Other campuses only",
    body: "Never someone from your own university.",
  },
  same: {
    title: "My campus only",
    body: "Handy if you want to meet up between lectures.",
  },
};

export const GREAT_REVEAL_EVENT = {
  name: "The Great Reveal",
  date: "Thu 10 Dec 2026 · 5:00 PM",
  venue: "Meetup booth, RIT Dubai atrium (Silicon Oasis)",
  note: "Satellite booths at AUS, UOS and Knowledge Park the same evening.",
};

export const LETTER_INTERVAL_MS = 24 * 60 * 60 * 1000;
/** Demo post: replies arrive after this delay instead of next morning. */
const DEMO_DELIVERY_MS = 40 * 1000;

export type University = (typeof UNIVERSITIES)[number];

export const INTERESTS = [
  "Design",
  "Startups",
  "Coding",
  "Film",
  "Music",
  "Gaming",
  "Sports",
  "Reading",
  "Volunteering",
  "Photography",
  "Debate",
  "Food",
] as const;

export type ChatMode = "pair" | "group";
export type ChatDuration = "minutes" | "day" | "forever";

export const DURATION_LABEL: Record<ChatDuration, string> = {
  minutes: "A few minutes",
  day: "A day",
  forever: "Forever",
};

export const DURATION_MS: Record<ChatDuration, number | null> = {
  minutes: 10 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  forever: null,
};

export type Profile = {
  alias: string;
  university: University;
  year: string;
  interests: string[];
  idPhotoName: string;
  verified: boolean;
  realName: string;
  crossCampusOnly: boolean;
  campusPref?: CampusPref;
  reducedMotion?: boolean;
};

export type SealColor = "coral" | "teal" | "lilac" | "butter";

export type Letter = {
  id: string;
  fromMe: boolean;
  subject: string;
  body: string;
  sentAt: number;
  deliverAt: number;
  read: boolean;
  seal: SealColor;
};

export type PenPal = {
  alias: string;
  university: University;
  revealedName: string;
  sharedInterest: string;
  since: number;
  greatReveal: { mine: boolean; theirs: boolean; agreedAt: number | null };
};

export type Member = {
  alias: string;
  university: University;
  revealedName: string;
  revealed: boolean;
  isMe?: boolean;
};

export type Message = {
  id: string;
  author: string;
  text: string;
  at: number;
  system?: boolean;
};

export type Thread = {
  id: string;
  mode: ChatMode;
  duration: ChatDuration;
  createdAt: number;
  expiresAt: number | null;
  members: Member[];
  messages: Message[];
  myRevealOffered: boolean;
  closed: boolean;
  sharedInterest: string;
};

export type BoardKind = "coffee" | "event" | "project";

export const BOARD_META: Record<
  BoardKind,
  {
    label: string;
    icon: string;
    chip: string;
    cta: string;
    joinedCta: string;
    unit: string;
    blurb: string;
  }
> = {
  coffee: {
    label: "Coffee chat",
    icon: "☕",
    chip: "bg-butter text-butter-foreground",
    cta: "Grab the other chair",
    joinedCta: "Chair saved — tap to give it up",
    unit: "want the other chair",
    blurb: "Ten to thirty minutes, one drink, zero obligation to become friends.",
  },
  event: {
    label: "Event partner",
    icon: "✦",
    chip: "bg-mint text-ink",
    cta: "Be their plus one",
    joinedCta: "You're their plus one — tap to back out",
    unit: "offered to tag along",
    blurb: "Someone already bought the ticket. They just don't want to walk in alone.",
  },
  project: {
    label: "Project collab",
    icon: "◎",
    chip: "bg-lilac/30 text-plum",
    cta: "Pitch yourself to the crew",
    joinedCta: "You're on the crew — tap to leave",
    unit: "pitched for a spot",
    blurb: "Real deliverables, real deadlines, still fully masked until you agree to meet.",
  },
};

export type BoardPost = {
  id: string;
  kind: BoardKind;
  title: string;
  body: string;
  university: University;
  when: string;
  alias: string;
  responses: number;
  joined: boolean;
  mine?: boolean;
  vibe?: string;
  spots?: number;
  hostYear?: string;
};

/** Masked students in the live pool — used by the swipe deck and campus filter. */
export const CANDIDATES: {
  alias: string;
  university: University;
  interest: string;
  line: string;
  year: string;
}[] = [
  { alias: "Auburn Otter", university: "RIT Dubai", interest: "Coding", line: "I debug better at 2am and I know that's a red flag.", year: "Year 3" },
  { alias: "Velvet Heron", university: "American University of Sharjah", interest: "Design", line: "I will judge your kerning gently and in private.", year: "Year 2" },
  { alias: "Cobalt Koi", university: "BITS Pilani Dubai", interest: "Startups", line: "Pitched a laundry app to my mother. She invested nothing.", year: "Year 4" },
  { alias: "Saffron Moth", university: "Middlesex University Dubai", interest: "Film", line: "Letterboxd is my personality. Please save me from it.", year: "Year 1" },
  { alias: "Marine Falcon", university: "Heriot-Watt University Dubai", interest: "Music", line: "I make beats nobody has heard, which keeps them perfect.", year: "Year 2" },
  { alias: "Ivory Lynx", university: "University of Wollongong in Dubai", interest: "Reading", line: "Currently 40 pages into 6 different books.", year: "Postgraduate" },
  { alias: "Amber Wren", university: "Manipal Academy of Higher Education Dubai", interest: "Food", line: "I have ranked every karak within 3km of campus.", year: "Year 3" },
  { alias: "Indigo Orca", university: "Murdoch University Dubai", interest: "Photography", line: "Golden hour in Al Quoz beats any filter, fight me.", year: "Year 2" },
  { alias: "Olive Ibis", university: "University of Sharjah", interest: "Volunteering", line: "Beach cleanups are my whole weekend and I'm not sorry.", year: "Year 1" },
  { alias: "Coral Fox", university: "Amity University Dubai", interest: "Debate", line: "I lost a debate once. In 2019. Still thinking about it.", year: "Year 4" },
  { alias: "Velvet Koi", university: "RIT Dubai", interest: "Gaming", line: "Ranked queue at 3am, lecture at 8am. Balance.", year: "Year 1" },
  { alias: "Cobalt Wren", university: "American University of Sharjah", interest: "Sports", line: "I run so I can eat. It's a closed loop.", year: "Year 3" },
];

type State = {
  profile: Profile | null;
  threads: Thread[];
  posts: BoardPost[];
  penPal: PenPal | null;
  letters: Letter[];
};

const STORAGE_KEY = "mist.state.v2";

const EMPTY_STATE = (): State => ({
  profile: null,
  threads: [],
  posts: SEED_POSTS,
  penPal: null,
  letters: [],
});

const ADJECTIVES = [
  "Auburn",
  "Velvet",
  "Cobalt",
  "Saffron",
  "Marine",
  "Ivory",
  "Amber",
  "Indigo",
  "Coral",
  "Olive",
];
const NOUNS = ["Otter", "Heron", "Falcon", "Koi", "Lynx", "Moth", "Wren", "Fox", "Orca", "Ibis"];

export function randomAlias() {
  const a = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const n = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${a} ${n}`;
}

const FAKE_NAMES = [
  "Layla H.",
  "Omar R.",
  "Sara K.",
  "Yusuf A.",
  "Mira D.",
  "Zayd N.",
  "Hana T.",
  "Karim B.",
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

const SEED_POSTS: BoardPost[] = [
  {
    id: "p1",
    kind: "coffee",
    title: "Explain thermodynamics to me over karak, I'll pay in pastry",
    body: "UOWD, second year, currently failing gracefully. Knowledge Village Costa, the one with the broken AC. Bring your trauma, I have the coffee.",
    university: "University of Wollongong in Dubai",
    when: "Thu 4:00 PM · Knowledge Village",
    alias: "Marine Koi",
    hostYear: "Year 2",
    vibe: "Study-adjacent",
    spots: 1,
    responses: 12,
    joined: false,
  },
  {
    id: "p2",
    kind: "event",
    title: "One spare ticket to the d3 film fest, must ask weird questions",
    body: "Heriot-Watt. I already bought two tickets in a moment of optimism. Friday 7pm, Dubai Design District. You do not have to like the film, only the walk after.",
    university: "Heriot-Watt University Dubai",
    when: "Fri 7:00 PM · d3",
    alias: "Ivory Wren",
    hostYear: "Year 3",
    vibe: "Loud, then quiet",
    spots: 1,
    responses: 23,
    joined: false,
  },
  {
    id: "p3",
    kind: "project",
    title: "Three-person hackathon crew, no egos, snacks provided",
    body: "RIT Dubai, Silicon Oasis. Building an orientation-week tool that doesn't suck. Need a designer and someone who actually ships instead of refactoring forever.",
    university: "RIT Dubai",
    when: "Registration closes Sun",
    alias: "Cobalt Lynx",
    hostYear: "Year 3",
    vibe: "Deadline energy",
    spots: 2,
    responses: 15,
    joined: false,
  },
  {
    id: "p4",
    kind: "coffee",
    title: "Transferred from Sharjah in week 6, know precisely zero people",
    body: "AUS. Twenty-minute walk-and-talk between lectures, no life story required. I'll ask you three questions, you ask me three, we both leave less invisible.",
    university: "American University of Sharjah",
    when: "Any weekday, 1–3 PM",
    alias: "Saffron Moth",
    hostYear: "Year 2",
    vibe: "Low pressure",
    spots: 1,
    responses: 31,
    joined: false,
  },
  {
    id: "p5",
    kind: "project",
    title: "Sharjah↔Dubai carpool app: I do backend, you do the part I hate",
    body: "MDX. The commute is 55 minutes and everyone drives alone, which is deranged. Need a product/design brain who can talk to humans on camera.",
    university: "Middlesex University Dubai",
    when: "Starting next week",
    alias: "Amber Falcon",
    hostYear: "Year 4",
    vibe: "Slightly serious",
    spots: 2,
    responses: 18,
    joined: false,
  },
  {
    id: "p6",
    kind: "event",
    title: "Inter-uni sports day: two tickets, one very quiet friend group",
    body: "RIT Dubai, Academic City, 9am and yes that is early. Would genuinely rather show up with a stranger than alone again. We can leave after the relay.",
    university: "RIT Dubai",
    when: "Sat 9:00 AM · Academic City",
    alias: "Olive Orca",
    hostYear: "Year 1",
    vibe: "Sunny, sweaty",
    spots: 1,
    responses: 9,
    joined: false,
  },
  {
    id: "p7",
    kind: "coffee",
    title: "BITS to Manipal is a 12 minute walk. We have never spoken.",
    body: "Same road, same food street, two entirely separate universes. Chai at Academic City, Tuesday, and we compare how badly our campuses do orientation.",
    university: "BITS Pilani Dubai",
    when: "Tue 3:30 PM · Academic City",
    alias: "Indigo Heron",
    hostYear: "Year 2",
    vibe: "Neighbourly",
    spots: 3,
    responses: 27,
    joined: false,
  },
  {
    id: "p8",
    kind: "project",
    title: "Murdoch media student needs a UOS science brain, on camera",
    body: "Short doc about Sharjah's disappearing night sky. You explain light pollution convincingly, I make you look cinematic. Three weekends, real credit in the titles.",
    university: "Murdoch University Dubai",
    when: "Shooting over 3 weekends",
    alias: "Velvet Ibis",
    hostYear: "Postgraduate",
    vibe: "Nerdy, nocturnal",
    spots: 1,
    responses: 7,
    joined: false,
  },
  {
    id: "p9",
    kind: "event",
    title: "Amity cultural night — need a plus one who also dances badly",
    body: "So I'm statistically not the worst one there. DIAC, Wednesday 6:30. Open to any campus, the Sharjah bus drops you basically at the door.",
    university: "Amity University Dubai",
    when: "Wed 6:30 PM · DIAC",
    alias: "Saffron Fox",
    hostYear: "Year 2",
    vibe: "Chaotic good",
    spots: 2,
    responses: 41,
    joined: false,
  },
  {
    id: "p10",
    kind: "coffee",
    title: "UOS postgrad, five people in my programme, all married",
    body: "University of Sharjah. I would like one (1) conversation that is not about my thesis. I know a cafe near the library where nobody from my department goes.",
    university: "University of Sharjah",
    when: "Sun or Mon, after 5 PM",
    alias: "Amber Lynx",
    hostYear: "Postgraduate",
    vibe: "Quietly desperate",
    spots: 1,
    responses: 14,
    joined: false,
  },
];

const LETTER_OPENERS = [
  {
    subject: "First letter, no pressure",
    body: "Dear stranger,\n\nI've never written a letter to someone I can't see. It's weirdly freeing. I'm writing this from the library between two lectures I'm not fully awake for.\n\nTell me one thing about your week that nobody else knows. I'll go first: I've eaten the same shawarma for lunch four days in a row and I regret nothing.\n\nYours, masked,",
  },
  {
    subject: "Postmarked from a very quiet campus",
    body: "Hi,\n\nThey said one letter a day, so I'm making this one count. I picked the same interest as you, which means we probably would have spoken at some event and both left early.\n\nWhat are you actually doing at university? Not the degree — the real reason.\n\nWrite back when the sun is up,",
  },
];

const LETTER_REPLIES = [
  {
    subject: "Re: your letter",
    body: "I read your letter twice, which I never do with texts.\n\nYou asked a real question so here's a real answer: I'm here because I wanted to start over somewhere nobody knew me. It worked a bit too well — hence the pen pal.\n\nYour turn. What would you tell me if you knew we'd never meet?\n\nUntil tomorrow,",
  },
  {
    subject: "Slow post, fast heart",
    body: "Waiting a full day for this reply was strangely nice. I actually thought about what to say.\n\nI'm from a campus across the city from yours, I think. If we make it to the end of term, I might be brave enough for the Great Reveal. Might.\n\nStill masked, still writing,",
  },
  {
    subject: "Re: the shawarma situation",
    body: "Four days in a row is commitment. I respect it.\n\nMy week: I finally joined a club, sat in the corner, said nothing, and counted it as growth. Anonymous letters are apparently my comfort zone.\n\nSend me a song for the bus tomorrow.\n\nWith ink-stained thumbs,",
  },
];

function loadState(): State {
  if (typeof window === "undefined") return EMPTY_STATE();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_STATE();
    const parsed = JSON.parse(raw) as Partial<State>;
    return {
      profile: parsed.profile ?? null,
      threads: parsed.threads ?? [],
      posts: parsed.posts?.length ? parsed.posts : SEED_POSTS,
      penPal: parsed.penPal ?? null,
      letters: parsed.letters ?? [],
    };
  } catch {
    return EMPTY_STATE();
  }
}

const OPENERS: Record<string, string[]> = {
  default: [
    "ok hi stranger. how's your week actually going?",
    "wait this is kind of thrilling. what are you studying?",
    "hello anonymous person. rate your semester out of 10",
  ],
};

const REPLIES = [
  "honestly same. the library is my personality now",
  "ok that's a good answer. what do you do when you're not on campus?",
  "wait we might have been in the same lecture hall and never spoken lol",
  "I like that this is anonymous, I say way more than usual",
  "have you been to any of the inter-uni events? I keep chickening out",
  "if we reveal and you're in my class I will simply pass away",
  "genuinely nice talking to you, this app was a good idea",
  "tell me one thing about your week that nobody else knows",
];

type Ctx = {
  ready: boolean;
  profile: Profile | null;
  threads: Thread[];
  posts: BoardPost[];
  penPal: PenPal | null;
  letters: Letter[];
  saveProfile: (p: Profile) => void;
  signOut: () => void;
  createThread: (opts: {
    mode: ChatMode;
    duration: ChatDuration;
    sharedInterest: string;
    partner?: { alias: string; university: University };
  }) => Thread;
  sendMessage: (threadId: string, text: string) => void;
  offerReveal: (threadId: string) => void;
  extendThread: (threadId: string) => void;
  closeThread: (threadId: string) => void;
  addPost: (p: Omit<BoardPost, "id" | "responses" | "joined" | "mine">) => void;
  toggleJoin: (postId: string) => void;
  assignPenPal: () => void;
  sendLetter: (subject: string, body: string, seal: SealColor) => void;
  markLetterRead: (id: string) => void;
  proposeGreatReveal: () => void;
  /** Demo control: rewinds the cooldown clock by a day so judges can post again. */
  skipADay: () => void;
};

const MistContext = createContext<Ctx | null>(null);

function campusPool(profile: Profile | null): University[] {
  if (!profile) return [...UNIVERSITIES];
  const pref: CampusPref = profile.campusPref ?? (profile.crossCampusOnly ? "cross" : "any");
  if (pref === "cross") return UNIVERSITIES.filter((u) => u !== profile.university);
  if (pref === "same") return [profile.university];
  return [...UNIVERSITIES];
}

export function MistProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(loadState());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or blocked — app still works in-memory */
    }
  }, [state, ready]);

  const saveProfile = useCallback((p: Profile) => {
    setState((s) => ({ ...s, profile: p }));
  }, []);

  const signOut = useCallback(() => {
    setState(EMPTY_STATE());
  }, []);

  const assignPenPal = useCallback(() => {
    setState((s) => {
      if (s.penPal || !s.profile) return s;
      const pool = campusPool(s.profile);
      const now = Date.now();
      const opener = LETTER_OPENERS[Math.floor(Math.random() * LETTER_OPENERS.length)]!;
      const penPal: PenPal = {
        alias: randomAlias(),
        university: pool[Math.floor(Math.random() * pool.length)]!,
        revealedName: FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)]!,
        sharedInterest: s.profile.interests[0] ?? "Design",
        since: now,
        greatReveal: { mine: false, theirs: false, agreedAt: null },
      };
      const first: Letter = {
        id: uid(),
        fromMe: false,
        subject: opener.subject,
        body: `${opener.body}\n${penPal.alias}`,
        sentAt: now - 6 * 60 * 60 * 1000,
        deliverAt: now,
        read: false,
        seal: "lilac",
      };
      return { ...s, penPal, letters: [first] };
    });
  }, []);

  const sendLetter = useCallback<Ctx["sendLetter"]>((subject, body, seal) => {
    const s0 = subject.trim().slice(0, 80);
    const b0 = body.trim().slice(0, 2000);
    if (!b0) return;
    const now = Date.now();
    setState((s) => {
      const lastMine = s.letters.filter((l) => l.fromMe).sort((a, b) => b.sentAt - a.sentAt)[0];
      if (lastMine && now - lastMine.sentAt < LETTER_INTERVAL_MS) return s;
      const mine: Letter = {
        id: uid(),
        fromMe: true,
        subject: s0 || "(no subject)",
        body: b0,
        sentAt: now,
        deliverAt: now,
        read: true,
        seal,
      };
      return { ...s, letters: [mine, ...s.letters] };
    });
    window.setTimeout(() => {
      setState((s) => {
        if (!s.penPal) return s;
        const reply = LETTER_REPLIES[Math.floor(Math.random() * LETTER_REPLIES.length)]!;
        const t = Date.now();
        const letter: Letter = {
          id: uid(),
          fromMe: false,
          subject: reply.subject,
          body: `${reply.body}\n${s.penPal.alias}`,
          sentAt: t,
          deliverAt: t,
          read: false,
          seal: (["coral", "teal", "lilac", "butter"] as SealColor[])[
            Math.floor(Math.random() * 4)
          ]!,
        };
        return { ...s, letters: [letter, ...s.letters] };
      });
    }, DEMO_DELIVERY_MS);
  }, []);

  const markLetterRead = useCallback<Ctx["markLetterRead"]>((id) => {
    setState((s) => ({
      ...s,
      letters: s.letters.map((l) => (l.id === id ? { ...l, read: true } : l)),
    }));
  }, []);

  const skipADay = useCallback(() => {
    setState((s) => ({
      ...s,
      letters: s.letters.map((l) =>
        l.fromMe ? { ...l, sentAt: l.sentAt - LETTER_INTERVAL_MS, deliverAt: l.deliverAt - LETTER_INTERVAL_MS } : l,
      ),
    }));
  }, []);

  const proposeGreatReveal = useCallback(() => {
    setState((s) =>
      s.penPal ? { ...s, penPal: { ...s.penPal, greatReveal: { ...s.penPal.greatReveal, mine: true } } } : s,
    );
    window.setTimeout(() => {
      setState((s) =>
        s.penPal && s.penPal.greatReveal.mine
          ? {
              ...s,
              penPal: {
                ...s.penPal,
                greatReveal: { mine: true, theirs: true, agreedAt: Date.now() },
              },
            }
          : s,
      );
    }, 3200);
  }, []);

  const createThread = useCallback<Ctx["createThread"]>(
    ({ mode, duration, sharedInterest, partner }) => {
      const me: Member = {
        alias: state.profile?.alias ?? randomAlias(),
        university: state.profile?.university ?? UNIVERSITIES[0],
        revealedName: state.profile?.realName ?? "You",
        revealed: false,
        isMe: true,
      };
      const otherCount = mode === "pair" ? 1 : 2 + Math.floor(Math.random() * 2);
      const pool = campusPool(state.profile);
      const others: Member[] = Array.from({ length: otherCount }, (_, i) => ({
        alias: i === 0 && partner ? partner.alias : randomAlias(),
        university:
          i === 0 && partner ? partner.university : pool[Math.floor(Math.random() * pool.length)]!,
        revealedName: FAKE_NAMES[(i + Math.floor(Math.random() * 4)) % FAKE_NAMES.length]!,
        revealed: false,
      }));
      const now = Date.now();
      const span = DURATION_MS[duration];
      const opener = OPENERS["default"]![Math.floor(Math.random() * OPENERS["default"]!.length)]!;
      const thread: Thread = {
        id: uid(),
        mode,
        duration,
        createdAt: now,
        expiresAt: span ? now + span : null,
        members: [me, ...others],
        sharedInterest,
        myRevealOffered: false,
        closed: false,
        messages: [
          {
            id: uid(),
            author: "system",
            system: true,
            at: now,
            text:
              mode === "pair"
                ? `You were paired anonymously. You both picked "${sharedInterest}".`
                : `You joined an anonymous group of ${otherCount + 1}. Shared interest: "${sharedInterest}".`,
          },
          { id: uid(), author: others[0]!.alias, text: opener, at: now + 800 },
        ],
      };
      setState((s) => ({ ...s, threads: [thread, ...s.threads] }));
      return thread;
    },
    [state.profile],
  );

  const sendMessage = useCallback<Ctx["sendMessage"]>((threadId, text) => {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      threads: s.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              messages: [...t.messages, { id: uid(), author: "me", text: trimmed, at: Date.now() }],
            }
          : t,
      ),
    }));
    const delay = 1100 + Math.random() * 1400;
    setTimeout(() => {
      setState((s) => ({
        ...s,
        threads: s.threads.map((t) => {
          if (t.id !== threadId || t.closed) return t;
          const others = t.members.filter((m) => !m.isMe);
          const who = others[Math.floor(Math.random() * others.length)];
          if (!who) return t;
          return {
            ...t,
            messages: [
              ...t.messages,
              {
                id: uid(),
                author: who.alias,
                text: REPLIES[Math.floor(Math.random() * REPLIES.length)]!,
                at: Date.now(),
              },
            ],
          };
        }),
      }));
    }, delay);
  }, []);

  const offerReveal = useCallback<Ctx["offerReveal"]>((threadId) => {
    setState((s) => ({
      ...s,
      threads: s.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              myRevealOffered: true,
              members: t.members.map((m) => (m.isMe ? { ...m, revealed: true } : m)),
              messages: [
                ...t.messages,
                {
                  id: uid(),
                  author: "system",
                  system: true,
                  at: Date.now(),
                  text: "You lifted your mask. Others can now see your name — they reveal only if they want to.",
                },
              ],
            }
          : t,
      ),
    }));
    setTimeout(() => {
      setState((s) => ({
        ...s,
        threads: s.threads.map((t) => {
          if (t.id !== threadId) return t;
          const other = t.members.find((m) => !m.isMe && !m.revealed);
          if (!other) return t;
          return {
            ...t,
            members: t.members.map((m) =>
              m.alias === other.alias ? { ...m, revealed: true } : m,
            ),
            messages: [
              ...t.messages,
              {
                id: uid(),
                author: "system",
                system: true,
                at: Date.now(),
                text: `${other.alias} revealed too — say hi to ${other.revealedName}`,
              },
            ],
          };
        }),
      }));
    }, 2600);
  }, []);

  const extendThread = useCallback<Ctx["extendThread"]>((threadId) => {
    setState((s) => ({
      ...s,
      threads: s.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              closed: false,
              duration: t.duration === "minutes" ? "day" : "forever",
              expiresAt:
                t.duration === "minutes" ? Date.now() + DURATION_MS["day"]! : null,
              messages: [
                ...t.messages,
                {
                  id: uid(),
                  author: "system",
                  system: true,
                  at: Date.now(),
                  text:
                    t.duration === "minutes"
                      ? "Both of you kept it open. This thread now lasts a day."
                      : "This thread is now open forever.",
                },
              ],
            }
          : t,
      ),
    }));
  }, []);

  const closeThread = useCallback<Ctx["closeThread"]>((threadId) => {
    setState((s) => ({
      ...s,
      threads: s.threads.map((t) => (t.id === threadId ? { ...t, closed: true } : t)),
    }));
  }, []);

  const addPost = useCallback<Ctx["addPost"]>((p) => {
    setState((s) => ({
      ...s,
      posts: [{ ...p, id: uid(), responses: 0, joined: false, mine: true }, ...s.posts],
    }));
  }, []);

  const toggleJoin = useCallback<Ctx["toggleJoin"]>((postId) => {
    setState((s) => ({
      ...s,
      posts: s.posts.map((p) =>
        p.id === postId
          ? { ...p, joined: !p.joined, responses: p.responses + (p.joined ? -1 : 1) }
          : p,
      ),
    }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      profile: state.profile,
      threads: state.threads,
      posts: state.posts,
      penPal: state.penPal,
      letters: state.letters,
      saveProfile,
      signOut,
      createThread,
      sendMessage,
      offerReveal,
      extendThread,
      closeThread,
      addPost,
      toggleJoin,
      assignPenPal,
      sendLetter,
      markLetterRead,
      proposeGreatReveal,
      skipADay,
    }),
    [
      ready,
      state,
      saveProfile,
      signOut,
      createThread,
      sendMessage,
      offerReveal,
      extendThread,
      closeThread,
      addPost,
      toggleJoin,
      assignPenPal,
      sendLetter,
      markLetterRead,
      proposeGreatReveal,
      skipADay,
    ],
  );

  return <MistContext.Provider value={value}>{children}</MistContext.Provider>;
}

export function useMist() {
  const ctx = useContext(MistContext);
  if (!ctx) throw new Error("useMist must be used inside MistProvider");
  return ctx;
}

export function formatCountdown(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
