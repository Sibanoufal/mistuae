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
] as const;

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
  reducedMotion?: boolean;
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
};

const STORAGE_KEY = "mist.state.v1";

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
];

function loadState(): State {
  if (typeof window === "undefined") return { profile: null, threads: [], posts: SEED_POSTS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { profile: null, threads: [], posts: SEED_POSTS };
    const parsed = JSON.parse(raw) as State;
    return {
      profile: parsed.profile ?? null,
      threads: parsed.threads ?? [],
      posts: parsed.posts?.length ? parsed.posts : SEED_POSTS,
    };
  } catch {
    return { profile: null, threads: [], posts: SEED_POSTS };
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
                text: `${other.alias} revealed too — say hi to ${other.revealedName}.`,
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
