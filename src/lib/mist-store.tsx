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
};

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
    title: "Someone to explain thermodynamics over karak",
    body: "2nd year engineering. Meeting near the food court, bring your trauma — I have the coffee.",
    university: "University of Wollongong in Dubai",
    when: "Thu 4:00 PM · Knowledge Village",
    alias: "Marine Koi",
    responses: 12,
    joined: false,
  },
  {
    id: "p2",
    kind: "event",
    title: "Need one more for the film fest panel",
    body: "Friday 7pm at the Dubai Design District. Looking for a wingman who asks weird questions.",
    university: "Heriot-Watt University Dubai",
    when: "Fri 7:00 PM · d3",
    alias: "Ivory Wren",
    responses: 8,
    joined: false,
  },
  {
    id: "p3",
    kind: "project",
    title: "Crew of 3 for the campus hackathon, no egos",
    body: "Building something for orientation week. Want a designer + someone who actually ships.",
    university: "RIT Dubai",
    when: "Registration closes Sun",
    alias: "Cobalt Lynx",
    responses: 5,
    joined: false,
  },
  {
    id: "p4",
    kind: "coffee",
    title: "First-semester transfer, know nobody",
    body: "Moved from Sharjah campus. Anyone free for a 20 minute walk-and-talk between lectures?",
    university: "American University of Sharjah",
    when: "Any weekday, 1–3 PM",
    alias: "Saffron Moth",
    responses: 17,
    joined: false,
  },
  {
    id: "p5",
    kind: "project",
    title: "Looking for a co-founder-ish person for a tiny app",
    body: "Idea: campus carpool between Sharjah and Dubai. I do backend, need product/design brain.",
    university: "Middlesex University Dubai",
    when: "Starting next week",
    alias: "Amber Falcon",
    responses: 9,
    joined: false,
  },
  {
    id: "p6",
    kind: "event",
    title: "Two tickets, one very quiet friend group",
    body: "Inter-uni sports day. Would rather show up with a stranger than alone, honestly.",
    university: "RIT Dubai",
    when: "Sat 9:00 AM · Academic City",
    alias: "Olive Orca",
    responses: 6,
    joined: false,
  },
  {
    id: "p7",
    kind: "coffee",
    title: "BITS to Manipal is a 12 minute walk. Anyone?",
    body: "Same road, never met anyone from next door. Chai at the Academic City food street?",
    university: "BITS Pilani Dubai",
    when: "Tue 3:30 PM · Academic City",
    alias: "Indigo Heron",
    responses: 11,
    joined: false,
  },
  {
    id: "p8",
    kind: "project",
    title: "Murdoch media student needs a UOS science brain",
    body: "Making a short doc on Sharjah's night sky. Need someone who can explain light pollution on camera.",
    university: "Murdoch University Dubai",
    when: "Shooting over 3 weekends",
    alias: "Velvet Ibis",
    responses: 4,
    joined: false,
  },
  {
    id: "p9",
    kind: "event",
    title: "Amity cultural night — need a plus one who dances badly",
    body: "So I'm not the only one. Open to any campus, the bus from Sharjah is easy.",
    university: "Amity University Dubai",
    when: "Wed 6:30 PM · DIAC",
    alias: "Saffron Fox",
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
  saveProfile: (p: Profile) => void;
  signOut: () => void;
  createThread: (opts: {
    mode: ChatMode;
    duration: ChatDuration;
    sharedInterest: string;
  }) => Thread;
  sendMessage: (threadId: string, text: string) => void;
  offerReveal: (threadId: string) => void;
  extendThread: (threadId: string) => void;
  closeThread: (threadId: string) => void;
  addPost: (p: Omit<BoardPost, "id" | "responses" | "joined" | "mine">) => void;
  toggleJoin: (postId: string) => void;
};

const MistContext = createContext<Ctx | null>(null);

export function MistProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ profile: null, threads: [], posts: SEED_POSTS });
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
    setState({ profile: null, threads: [], posts: SEED_POSTS });
  }, []);

  const createThread = useCallback<Ctx["createThread"]>(
    ({ mode, duration, sharedInterest }) => {
      const me: Member = {
        alias: state.profile?.alias ?? randomAlias(),
        university: state.profile?.university ?? UNIVERSITIES[0],
        revealedName: state.profile?.realName ?? "You",
        revealed: false,
        isMe: true,
      };
      const otherCount = mode === "pair" ? 1 : 2 + Math.floor(Math.random() * 2);
      const pool = UNIVERSITIES.filter((u) =>
        state.profile?.crossCampusOnly ? u !== state.profile.university : true,
      );
      const others: Member[] = Array.from({ length: otherCount }, (_, i) => ({
        alias: randomAlias(),
        university: pool[Math.floor(Math.random() * pool.length)]!,
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
      saveProfile,
      signOut,
      createThread,
      sendMessage,
      offerReveal,
      extendThread,
      closeThread,
      addPost,
      toggleJoin,
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
