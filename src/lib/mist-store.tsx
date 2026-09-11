import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { SEED_PEOPLE, SEED_ROOMS, type Gender, type MatchWith, type PurposeId } from "./mist-social";

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
  venue: "Meetup booth, RIT Dubai atrium (Dubai Silicon Oasis)",
  note: "Satellite booths at Academic City, Knowledge Park and Sharjah University City the same evening.",
};

/** Where each campus physically sits — used for honest travel copy. */
export const CAMPUS_AREA: Record<University, string> = {
  "RIT Dubai": "Dubai Silicon Oasis",
  "Middlesex University Dubai": "Dubai Knowledge Park",
  "American University of Sharjah": "University City, Sharjah",
  "Heriot-Watt University Dubai": "Dubai Knowledge Park",
  "University of Wollongong in Dubai": "Dubai Knowledge Park",
  "Manipal Academy of Higher Education Dubai": "Dubai International Academic City",
  "BITS Pilani Dubai": "Dubai International Academic City",
  "Murdoch University Dubai": "Dubai Knowledge Park",
  "University of Sharjah": "University City, Sharjah",
  "Amity University Dubai": "Dubai International Academic City",
};

export const CAMPUS_CLUSTERS: { area: string; blurb: string; members: University[] }[] = [
  {
    area: "Dubai International Academic City",
    blurb: "Three campuses on walking distance from each other.",
    members: [
      "Manipal Academy of Higher Education Dubai",
      "BITS Pilani Dubai",
      "Amity University Dubai",
    ],
  },
  {
    area: "Dubai Knowledge Park",
    blurb: "Four campuses sharing one strip of Al Sufouh.",
    members: [
      "Middlesex University Dubai",
      "Heriot-Watt University Dubai",
      "University of Wollongong in Dubai",
      "Murdoch University Dubai",
    ],
  },
  {
    area: "Dubai Silicon Oasis",
    blurb: "On its own — about 10 minutes' drive from Academic City.",
    members: ["RIT Dubai"],
  },
  {
    area: "University City, Sharjah",
    blurb: "Two large campuses side by side, ~40 minutes from Dubai.",
    members: ["American University of Sharjah", "University of Sharjah"],
  },
];

/** Rough travel time between the two campus clusters, in plain words. */
export function travelNote(a: University, b: University) {
  const areaA = CAMPUS_AREA[a];
  const areaB = CAMPUS_AREA[b];
  if (areaA === areaB) return `Same area — ${areaA}. Walkable.`;
  const dubai = (x: string) => x !== "University City, Sharjah";
  if (dubai(areaA) !== dubai(areaB)) return `${areaA} ↔ ${areaB} · roughly 40 minutes by car.`;
  if (areaA.includes("Silicon") || areaB.includes("Silicon")) {
    const other = areaA.includes("Silicon") ? areaB : areaA;
    return other.includes("Academic City")
      ? "Silicon Oasis ↔ Academic City · about 10 minutes by car."
      : `${areaA} ↔ ${areaB} · about 30 minutes by car.`;
  }
  return `${areaA} ↔ ${areaB} · about 30 minutes by car or metro + feeder bus.`;
}


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
  /** Faculty → course → year is how campus-only communities are grouped. */
  faculty?: string;
  course?: string;
  /** Why you're here: study partner, project partner, coffee, networking, society. */
  purposes?: PurposeId[];
  /** Availability slots like "Tue-pm". */
  slots?: string[];
  gender?: Gender;
  matchWith?: MatchWith;
  /** Off = you disappear from discovery, rooms lists and recommendations. */
  discoverable?: boolean;
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
  /** 0 = fully anonymous, 1 = basics shared, 2 = names revealed. */
  revealStage?: 0 | 1 | 2;
  purpose?: PurposeId;
  rated?: boolean;
};

export type BoardKind = "coffee" | "event" | "project" | "study" | "society";

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
  emoji?: string;
  spots?: number;
  hostNote?: string;
  plan?: string[];
  interestedFrom?: University[];
  course?: string;
  faculty?: string;
  slots?: string[];
};

export const BOARD_CTA: Record<BoardKind, { idle: string; joined: string; verb: string }> = {
  coffee: { idle: "Save me a seat", joined: "Seat saved — tap to give it up", verb: "sitting down" },
  event: { idle: "Be my plus one", joined: "You're the plus one — tap to bail", verb: "going" },
  project: { idle: "Join the crew", joined: "You're on the crew — tap to step off", verb: "building" },
  study: { idle: "Study with them", joined: "You're on the table — tap to leave", verb: "studying" },
  society: { idle: "I'm going too", joined: "You're going — tap to cancel", verb: "going" },
};

export type Room = {
  id: string;
  name: string;
  emoji: string;
  topic: string;
  faculty: string;
  members: number;
  messages: Message[];
  joined: boolean;
};

export type Rating = { alias: string; tags: string[]; at: number };
export type Report = { alias: string; reason: string; note: string; at: number };


type State = {
  profile: Profile | null;
  threads: Thread[];
  posts: BoardPost[];
  penPal: PenPal | null;
  letters: Letter[];
  rooms: Room[];
  blocked: string[];
  reports: Report[];
  ratings: Rating[];
};

const STORAGE_KEY = "mist.state.v4";

const SEEDED_ROOMS = (): Room[] =>
  SEED_ROOMS.map((r) => ({
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    topic: r.topic,
    faculty: r.faculty,
    members: r.members,
    joined: false,
    messages: r.seed.map(([author, text], i) => ({
      id: `${r.id}-${i}`,
      author,
      text,
      at: Date.now() - (r.seed.length - i) * 7 * 60 * 1000,
    })),
  }));

const EMPTY_STATE = (): State => ({
  profile: null,
  threads: [],
  posts: SEED_POSTS,
  penPal: null,
  letters: [],
  rooms: SEEDED_ROOMS(),
  blocked: [],
  reports: [],
  ratings: [],
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
    emoji: "☕",
    title: "Karak and thermodynamics, in that order",
    body: "Second-year engineering at UOWD. I understand entropy emotionally but not mathematically. Bring a pen, I'll bring the karak from the Knowledge Park cafeteria.",
    university: "University of Wollongong in Dubai",
    when: "Thu 4:00 PM · Knowledge Park, block 5 courtyard",
    alias: "Marine Koi",
    responses: 12,
    joined: false,
    spots: 2,
    hostNote: "Host has completed 4 coffee chats · never no-showed",
    plan: [
      "Meet by the fountain steps, both wearing something teal so we spot each other.",
      "45 minutes max — I have a lab at 5.",
      "You stay masked the whole time if you want. Aliases only is completely normal here.",
    ],
    interestedFrom: [
      "Heriot-Watt University Dubai",
      "Murdoch University Dubai",
      "Middlesex University Dubai",
    ],
  },
  {
    id: "p2",
    kind: "event",
    emoji: "🎬",
    title: "One more human for the d3 film night panel",
    body: "Heriot-Watt, Knowledge Park. I have two tickets and one friend who cancelled twice. Looking for someone who asks the weird question during Q&A so I don't have to.",
    university: "Heriot-Watt University Dubai",
    when: "Fri 7:00 PM · Dubai Design District (d3)",
    alias: "Ivory Wren",
    responses: 8,
    joined: false,
    spots: 1,
    hostNote: "Ticket already paid for · you owe me nothing but conversation",
    plan: [
      "Meet at the d3 building 7 steps at 6:40 PM.",
      "Screening runs 90 minutes, Q&A after.",
      "We can split a Careem back towards Knowledge Park or Academic City.",
    ],
    interestedFrom: ["University of Wollongong in Dubai", "American University of Sharjah"],
  },
  {
    id: "p3",
    kind: "project",
    emoji: "⚡",
    title: "Hackathon crew of 3. No egos, no 3am heroics.",
    body: "RIT Dubai, Silicon Oasis. Building an orientation-week tool. I write backend badly but reliably. Need a designer and one person who actually finishes things.",
    university: "RIT Dubai",
    when: "Registration closes Sun · 6 weeks of build",
    alias: "Cobalt Lynx",
    responses: 5,
    joined: false,
    spots: 2,
    hostNote: "Repo already set up · we work Sat afternoons only",
    plan: [
      "First call is voice-only and masked — nobody has to show a face.",
      "Weekly two-hour session, in person at the RIT library or online.",
      "If we submit, names go on the entry — so we'd unmask before the deadline, together.",
    ],
    interestedFrom: ["BITS Pilani Dubai", "Amity University Dubai"],
  },
  {
    id: "p4",
    kind: "coffee",
    emoji: "🚶",
    title: "Transferred to AUS in week 6. I know exactly zero people.",
    body: "Sharjah University City. Everyone already has their group and I've eaten lunch in my car three times this week, which is objectively tragic. 20-minute walk-and-talk?",
    university: "American University of Sharjah",
    when: "Any weekday, 1–3 PM · University City ring road",
    alias: "Saffron Moth",
    responses: 17,
    joined: false,
    spots: 3,
    hostNote: "Most-answered post on the board this week",
    plan: [
      "We walk the loop between AUS and UOS — it's about 20 minutes.",
      "No coffee shop, no bill, no awkward 'should we leave now' moment.",
      "Masks stay on. First names only if it happens naturally.",
    ],
    interestedFrom: ["University of Sharjah", "American University of Sharjah"],
  },
  {
    id: "p5",
    kind: "project",
    emoji: "🚗",
    title: "Carpool app for the Sharjah → Dubai commute (someone please)",
    body: "MDX, Knowledge Park. I do the 40-minute drive from Sharjah every morning with three empty seats and rage. I can build backend. I need a product brain who has opinions.",
    university: "Middlesex University Dubai",
    when: "Starting next week · 2 evenings a week",
    alias: "Amber Falcon",
    responses: 9,
    joined: false,
    spots: 2,
    hostNote: "Already surveyed 60 commuters · data is real",
    plan: [
      "Week 1: we scope it over letters, no meetings.",
      "Week 2: one call, still masked.",
      "If it works, we pitch it to both student councils.",
    ],
    interestedFrom: ["University of Sharjah", "RIT Dubai", "Heriot-Watt University Dubai"],
  },
  {
    id: "p6",
    kind: "event",
    emoji: "🏐",
    title: "Inter-uni sports day. I'd rather bring a stranger than nobody.",
    body: "RIT Dubai. It's a 10-minute drive from Silicon Oasis over to Academic City, so Manipal/BITS/Amity people, this one is basically next door for you.",
    university: "RIT Dubai",
    when: "Sat 9:00 AM · Academic City sports fields",
    alias: "Olive Orca",
    responses: 6,
    joined: false,
    spots: 4,
    hostNote: "I can drive two people from Silicon Oasis",
    plan: [
      "Meet at gate 2 at 8:45 AM.",
      "We sign up as a mixed-campus team, which scores bonus points.",
      "Breakfast after at the Academic City food street.",
    ],
    interestedFrom: ["BITS Pilani Dubai", "Manipal Academy of Higher Education Dubai"],
  },
  {
    id: "p7",
    kind: "coffee",
    emoji: "🫖",
    title: "BITS to Manipal is a four-minute walk. We have never met.",
    body: "Same road in Academic City, same canteen prices, entirely separate universes. Chai at the food street and we fix inter-campus relations personally.",
    university: "BITS Pilani Dubai",
    when: "Tue 3:30 PM · Academic City food street",
    alias: "Indigo Heron",
    responses: 11,
    joined: false,
    spots: 3,
    hostNote: "Open to Amity people too — you're on the same block",
    plan: [
      "Meet outside the food street entrance, I'll be the one holding two chais.",
      "30 minutes. If it's awkward we blame the traffic and leave.",
      "Aliases only unless you say otherwise.",
    ],
    interestedFrom: [
      "Manipal Academy of Higher Education Dubai",
      "Amity University Dubai",
      "BITS Pilani Dubai",
    ],
  },
  {
    id: "p8",
    kind: "project",
    emoji: "🔭",
    title: "Murdoch media student needs a UOS science brain on camera",
    body: "Short doc about how much of the night sky Sharjah has lost. I can shoot and edit. I cannot explain light pollution without saying 'the sky is, like, broken'.",
    university: "Murdoch University Dubai",
    when: "3 weekends · shooting in Sharjah + Al Qudra",
    alias: "Velvet Ibis",
    responses: 4,
    joined: false,
    spots: 1,
    hostNote: "Camera gear covered · petrol split",
    plan: [
      "Sunday call to script your two minutes.",
      "One night shoot at Al Qudra, one on the UOS campus.",
      "You can appear voice-only if you'd rather stay unseen.",
    ],
    interestedFrom: ["University of Sharjah", "American University of Sharjah"],
  },
  {
    id: "p9",
    kind: "event",
    emoji: "💃",
    title: "Amity cultural night — need a plus one who also dances badly",
    body: "Academic City. I refuse to be the only person doing the wrong steps in the front row. Manipal and BITS are literally down the road, no excuses.",
    university: "Amity University Dubai",
    when: "Wed 6:30 PM · Amity auditorium, Academic City",
    alias: "Saffron Fox",
    responses: 14,
    joined: false,
    spots: 2,
    hostNote: "Guest passes handled at the door",
    plan: [
      "Meet at the auditorium doors at 6:15 PM.",
      "Two hours, snacks included, exit whenever.",
      "Nobody unmasks unless both of you want to.",
    ],
    interestedFrom: [
      "BITS Pilani Dubai",
      "Manipal Academy of Higher Education Dubai",
      "RIT Dubai",
    ],
  },
  {
    id: "p10",
    kind: "coffee",
    emoji: "📚",
    title: "Postgrad, cohort of nine, all of them are married with children",
    body: "UOS. Lovely people, but nobody wants to sit in a café for two hours and complain about referencing styles. I do. Sharjah or Dubai, I'll travel.",
    university: "University of Sharjah",
    when: "Sunday afternoons · Sharjah or anywhere on the metro red line",
    alias: "Velvet Heron",
    responses: 7,
    joined: false,
    spots: 2,
    hostNote: "Happy to come to Dubai — the 40 minutes is fine, honestly",
    plan: [
      "Pick a café halfway, probably somewhere near the airport road.",
      "Bring whatever you're procrastinating on.",
      "Two hours of parallel work with talking in between.",
    ],
    interestedFrom: ["American University of Sharjah", "Middlesex University Dubai"],
  },
  {
    id: "p11",
    kind: "event",
    emoji: "🎧",
    title: "Free gig at Knowledge Park and my friends only like studying",
    body: "Manipal, Academic City. It's a half-hour drive across town for me, which I will happily do if someone is on the other end of it.",
    when: "Thu 8:00 PM · Knowledge Park amphitheatre",
    university: "Manipal Academy of Higher Education Dubai",
    alias: "Coral Wren",
    responses: 10,
    joined: false,
    spots: 3,
    hostNote: "Driving from Academic City · two spare seats",
    plan: [
      "I leave Academic City at 7:15 PM, pickup possible on the way.",
      "Gig ends around 10.",
      "Knowledge Park people: you can just walk over, obviously.",
    ],
    interestedFrom: [
      "Heriot-Watt University Dubai",
      "University of Wollongong in Dubai",
      "Murdoch University Dubai",
    ],
  },
  {
    id: "p12",
    kind: "project",
    emoji: "🌱",
    title: "Ten campuses, zero shared clothing swap. Let's fix that.",
    body: "Heriot-Watt, Knowledge Park. Idea: one rotating swap that visits Knowledge Park, Academic City and Sharjah University City over a term. Need people at the other two.",
    when: "Planning now · first swap after midterms",
    university: "Heriot-Watt University Dubai",
    alias: "Olive Moth",
    responses: 13,
    joined: false,
    spots: 5,
    hostNote: "Needs at least one person per cluster · 2 of 3 covered",
    plan: [
      "Anonymous planning over letters first — no meetings until we have a date.",
      "Each area lead books one room on their own campus.",
      "Reveal is optional even on the day; volunteers can wear alias badges.",
    ],
    interestedFrom: [
      "Amity University Dubai",
      "University of Sharjah",
      "RIT Dubai",
      "Middlesex University Dubai",
    ],
  },
  {
    id: "p13",
    kind: "study",
    emoji: "📚",
    title: "Anyone taking Contract Law this semester?",
    body: "Heriot-Watt, but I don't care which uni you're at — the cases are the same. Three people, one hour, Thursdays. We read, we argue, we leave.",
    university: "Heriot-Watt University Dubai",
    when: "Thu 2–4 PM · Knowledge Park library",
    alias: "Ivory Wren",
    responses: 9,
    joined: false,
    spots: 2,
    course: "Contract Law",
    faculty: "Law",
    slots: ["Thu-pm"],
    hostNote: "Ran the same table last semester · everyone passed",
    plan: [
      "We each summarise two cases before we sit down.",
      "One hour, no phones, aliases only.",
      "If it works we repeat it every Thursday until finals.",
    ],
    interestedFrom: ["University of Sharjah", "Middlesex University Dubai"],
  },
  {
    id: "p14",
    kind: "study",
    emoji: "🧮",
    title: "Need 1 person for a marketing project (data is already done)",
    body: "MDX, second year. I surveyed 60 commuters and have a spreadsheet nobody has opinions about. Bring opinions. That's the whole job description.",
    university: "Middlesex University Dubai",
    when: "Two evenings a week · starts Monday",
    alias: "Amber Falcon",
    responses: 6,
    joined: false,
    spots: 1,
    course: "Marketing Principles",
    faculty: "Business & Management",
    slots: ["Tue-pm", "Wed-pm"],
    hostNote: "Marked 'reliable collaborator' by 4 people",
    plan: [
      "Scope it over messages first — no meetings in week one.",
      "One call, still masked.",
      "Names go on the submission, so we unmask together before the deadline.",
    ],
    interestedFrom: ["Amity University Dubai", "RIT Dubai"],
  },
  {
    id: "p15",
    kind: "society",
    emoji: "🎟️",
    title: "AI Society open night — say you're going, find others going",
    body: "Posted by the BITS AI Society. Anonymous RSVPs: you'll see how many students from each campus are coming without anyone seeing who you are.",
    university: "BITS Pilani Dubai",
    when: "Tue 6:00 PM · Academic City, block 3 auditorium",
    alias: "BITS AI Society",
    responses: 38,
    joined: false,
    spots: 40,
    faculty: "Computer Science & IT",
    slots: ["Tue-eve"],
    hostNote: "Verified society account · open to all ten campuses",
    plan: [
      "RSVP anonymously — we only publish campus counts.",
      "Talks 6–7, open floor after.",
      "There's a masked meet-up corner for people who came alone.",
    ],
    interestedFrom: [
      "Manipal Academy of Higher Education Dubai",
      "Amity University Dubai",
      "RIT Dubai",
    ],
  },
  {
    id: "p16",
    kind: "society",
    emoji: "🌱",
    title: "Sustainability Society beach clean — bring nobody, meet everybody",
    body: "UOWD society post. Half the people who come every month arrive alone. Tick 'going' and you'll be put in a masked group chat with the others who did.",
    university: "University of Wollongong in Dubai",
    when: "Sat 7:30 AM · Umm Suqeim beach",
    alias: "UOWD Sustainability Society",
    responses: 52,
    joined: false,
    spots: 60,
    faculty: "Everyone",
    slots: ["Sat-am"],
    hostNote: "Verified society account · transport from Knowledge Park",
    plan: [
      "Meet at the Knowledge Park gate at 7 AM for the shared bus.",
      "Two hours, gloves and bags provided.",
      "Breakfast after — that's where people actually talk.",
    ],
    interestedFrom: ["Heriot-Watt University Dubai", "Murdoch University Dubai"],
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
      rooms: parsed.rooms?.length ? parsed.rooms : SEEDED_ROOMS(),
      blocked: parsed.blocked ?? [],
      reports: parsed.reports ?? [],
      ratings: parsed.ratings ?? [],
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
  rooms: Room[];
  blocked: string[];
  reports: Report[];
  ratings: Rating[];
  createThread: (opts: {
    mode: ChatMode;
    duration: ChatDuration;
    sharedInterest: string;
    partner?: { alias: string; university: University };
    purpose?: PurposeId;
    groupSize?: number;
  }) => Thread;
  advanceReveal: (threadId: string) => void;
  rateInteraction: (threadId: string, alias: string, tags: string[]) => void;
  sendRoomMessage: (roomId: string, text: string) => void;
  toggleRoom: (roomId: string) => void;
  blockAlias: (alias: string) => void;
  unblockAlias: (alias: string) => void;
  reportAlias: (alias: string, reason: string, note: string) => void;
  setDiscoverable: (on: boolean) => void;
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
    ({ mode, duration, sharedInterest, partner, purpose, groupSize }) => {
      const me: Member = {
        alias: state.profile?.alias ?? randomAlias(),
        university: state.profile?.university ?? UNIVERSITIES[0],
        revealedName: state.profile?.realName ?? "You",
        revealed: false,
        isMe: true,
      };
      const otherCount =
        mode === "pair" ? 1 : Math.max(2, Math.min(4, (groupSize ?? 4) - 1));
      const pool = campusPool(state.profile);
      const others: Member[] = Array.from({ length: otherCount }, (_, i) => ({
        alias: i === 0 && partner ? partner.alias : randomAlias(),
        university:
          i === 0 && partner
            ? partner.university
            : pool[Math.floor(Math.random() * pool.length)]!,
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
        revealStage: 0,
        ...(purpose ? { purpose } : {}),
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

  /** Gradual reveal: anonymous → basics (campus, course, year) → names. */
  const advanceReveal = useCallback<Ctx["advanceReveal"]>((threadId) => {
    setState((s) => ({
      ...s,
      threads: s.threads.map((t) => {
        if (t.id !== threadId) return t;
        const stage = (t.revealStage ?? 0) as 0 | 1 | 2;
        if (stage >= 2) return t;
        const next = (stage + 1) as 1 | 2;
        const other = t.members.find((m) => !m.isMe);
        return {
          ...t,
          revealStage: next,
          members:
            next === 2 ? t.members.map((m) => ({ ...m, revealed: true })) : t.members,
          myRevealOffered: next === 2 ? true : t.myRevealOffered,
          messages: [
            ...t.messages,
            {
              id: uid(),
              author: "system",
              system: true,
              at: Date.now(),
              text:
                next === 1
                  ? "Step 2 of 3 — you both shared basics: campus, course and year. Still no names."
                  : `Step 3 of 3 — masks off. ${other ? `Say hi to ${other.revealedName}.` : ""}`,
            },
          ],
        };
      }),
    }));
  }, []);

  const rateInteraction = useCallback<Ctx["rateInteraction"]>((threadId, alias, tags) => {
    if (!tags.length) return;
    setState((s) => ({
      ...s,
      ratings: [{ alias, tags, at: Date.now() }, ...s.ratings],
      threads: s.threads.map((t) => (t.id === threadId ? { ...t, rated: true } : t)),
    }));
  }, []);

  const sendRoomMessage = useCallback<Ctx["sendRoomMessage"]>((roomId, text) => {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      rooms: s.rooms.map((r) =>
        r.id === roomId
          ? { ...r, messages: [...r.messages, { id: uid(), author: "me", text: trimmed, at: Date.now() }] }
          : r,
      ),
    }));
    window.setTimeout(
      () =>
        setState((s) => ({
          ...s,
          rooms: s.rooms.map((r) => {
            if (r.id !== roomId) return r;
            const speakers = r.messages.filter((m) => m.author !== "me").map((m) => m.author);
            const who = speakers[Math.floor(Math.random() * speakers.length)] ?? randomAlias();
            if (s.blocked.includes(who)) return r;
            return {
              ...r,
              messages: [
                ...r.messages,
                {
                  id: uid(),
                  author: who,
                  text: ROOM_REPLIES[Math.floor(Math.random() * ROOM_REPLIES.length)]!,
                  at: Date.now(),
                },
              ],
            };
          }),
        })),
      1400 + Math.random() * 1600,
    );
  }, []);

  const toggleRoom = useCallback<Ctx["toggleRoom"]>((roomId) => {
    setState((s) => ({
      ...s,
      rooms: s.rooms.map((r) =>
        r.id === roomId
          ? { ...r, joined: !r.joined, members: r.members + (r.joined ? -1 : 1) }
          : r,
      ),
    }));
  }, []);

  const blockAlias = useCallback<Ctx["blockAlias"]>((alias) => {
    setState((s) => ({
      ...s,
      blocked: s.blocked.includes(alias) ? s.blocked : [alias, ...s.blocked],
      threads: s.threads.map((t) =>
        t.members.some((m) => m.alias === alias) ? { ...t, closed: true } : t,
      ),
    }));
  }, []);

  const unblockAlias = useCallback<Ctx["unblockAlias"]>((alias) => {
    setState((s) => ({ ...s, blocked: s.blocked.filter((a) => a !== alias) }));
  }, []);

  const reportAlias = useCallback<Ctx["reportAlias"]>((alias, reason, note) => {
    setState((s) => ({
      ...s,
      reports: [{ alias, reason, note: note.trim().slice(0, 500), at: Date.now() }, ...s.reports],
    }));
  }, []);

  const setDiscoverable = useCallback<Ctx["setDiscoverable"]>((on) => {
    setState((s) => (s.profile ? { ...s, profile: { ...s.profile, discoverable: on } } : s));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ready,
      profile: state.profile,
      threads: state.threads,
      posts: state.posts,
      penPal: state.penPal,
      letters: state.letters,
      rooms: state.rooms,
      blocked: state.blocked,
      reports: state.reports,
      ratings: state.ratings,
      advanceReveal,
      rateInteraction,
      sendRoomMessage,
      toggleRoom,
      blockAlias,
      unblockAlias,
      reportAlias,
      setDiscoverable,
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
      advanceReveal,
      rateInteraction,
      sendRoomMessage,
      toggleRoom,
      blockAlias,
      unblockAlias,
      reportAlias,
      setDiscoverable,
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
