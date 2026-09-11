/**
 * Purpose-based matching, faculties, availability, open rooms and the
 * safety vocabulary used across Mist. Pure data — no React, no state.
 */

export type PurposeId =
  | "study"
  | "project"
  | "coffee"
  | "networking"
  | "society";

export const PURPOSES: {
  id: PurposeId;
  label: string;
  emoji: string;
  blurb: string;
  chip: string;
}[] = [
  {
    id: "study",
    label: "Study partner",
    emoji: "📚",
    blurb: "Same module, same panic, shared library table.",
    chip: "bg-mint text-ink",
  },
  {
    id: "project",
    label: "Project partner",
    emoji: "◎",
    blurb: "Group assignments, hackathons, final-year builds.",
    chip: "bg-lilac/30 text-plum",
  },
  {
    id: "coffee",
    label: "Coffee chat",
    emoji: "☕",
    blurb: "Twenty low-stakes minutes between lectures.",
    chip: "bg-butter text-butter-foreground",
  },
  {
    id: "networking",
    label: "Networking",
    emoji: "🪪",
    blurb: "Internships, portfolios, people already in the field.",
    chip: "bg-teal/15 text-teal",
  },
  {
    id: "society",
    label: "Society buddy",
    emoji: "🎟️",
    blurb: "Someone to walk into the club fair with.",
    chip: "bg-coral/20 text-coral",
  },
];

export const PURPOSE_LABEL: Record<PurposeId, string> = Object.fromEntries(
  PURPOSES.map((p) => [p.id, p.label]),
) as Record<PurposeId, string>;

export const FACULTIES = [
  "Engineering",
  "Computer Science & IT",
  "Business & Management",
  "Law",
  "Media & Design",
  "Health Sciences",
  "Architecture",
  "Sciences",
  "Education & Psychology",
] as const;
export type Faculty = (typeof FACULTIES)[number];

export const COURSE_SUGGESTIONS: Record<string, string[]> = {
  Engineering: ["Thermodynamics II", "Signals & Systems", "Fluid Mechanics"],
  "Computer Science & IT": ["Data Structures", "Machine Learning", "Databases"],
  "Business & Management": ["Marketing Principles", "Corporate Finance", "Operations"],
  Law: ["Contract Law", "UAE Commercial Law", "Public International Law"],
  "Media & Design": ["Documentary Practice", "Typography", "Screenwriting"],
  "Health Sciences": ["Human Physiology", "Epidemiology", "Pharmacology"],
  Architecture: ["Design Studio 3", "Building Technology", "Urban Systems"],
  Sciences: ["Organic Chemistry", "Genetics", "Statistical Methods"],
  "Education & Psychology": ["Cognitive Psychology", "Research Methods", "Inclusive Education"],
};

export const AVAIL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
export const AVAIL_BLOCKS = [
  { id: "am", label: "Morning", hint: "8–12" },
  { id: "pm", label: "Afternoon", hint: "12–4" },
  { id: "eve", label: "Evening", hint: "4–8" },
] as const;

export function slotId(day: string, block: string) {
  return `${day}-${block}`;
}

export function slotLabel(id: string) {
  const [day, block] = id.split("-");
  const b = AVAIL_BLOCKS.find((x) => x.id === block);
  return `${day} ${b ? `${b.label.toLowerCase()} (${b.hint})` : ""}`.trim();
}

export const ALL_SLOTS = AVAIL_DAYS.flatMap((d) => AVAIL_BLOCKS.map((b) => slotId(d, b.id)));

export type Gender = "woman" | "man" | "nonbinary" | "undisclosed";
export const GENDERS: { id: Gender; label: string }[] = [
  { id: "woman", label: "Woman" },
  { id: "man", label: "Man" },
  { id: "nonbinary", label: "Non-binary" },
  { id: "undisclosed", label: "Prefer not to say" },
];

export type MatchWith = "everyone" | "women" | "men";
export const MATCH_WITH: { id: MatchWith; label: string; body: string }[] = [
  { id: "everyone", label: "Everyone", body: "Gender-neutral pool — the default." },
  { id: "women", label: "Women only", body: "You'll only be matched with students who selected woman." },
  { id: "men", label: "Men only", body: "You'll only be matched with students who selected man." },
];

export const COMMUNITY_RULES = [
  {
    title: "This is not a dating app",
    body: "Romantic or sexual solicitation gets an account removed on the first report. Purpose tags exist so nobody has to guess your intent.",
  },
  {
    title: "No pressure to unmask",
    body: "Reveal is a three-step ladder and every step needs both people. Asking repeatedly is harassment and is reportable.",
  },
  {
    title: "Unsolicited messages are capped",
    body: "You can open three new anonymous conversations a day. People you have never spoken to cannot flood your inbox.",
  },
  {
    title: "You can vanish",
    body: "Turn off discovery and you disappear from recommendations, rooms and boards instantly — your existing threads stay.",
  },
  {
    title: "Screenshots stay in the room",
    body: "Sharing a masked student's messages or identity outside Mist is a permanent ban. Report it if it happens to you.",
  },
];

export const REPORT_REASONS = [
  "Romantic or sexual solicitation",
  "Pressuring me to reveal my identity",
  "Harassment or insults",
  "Spam or self-promotion",
  "Shared my messages outside Mist",
  "Something else",
];

export const TRUST_TAGS = [
  "Showed up on time",
  "Reliable collaborator",
  "Respectful",
  "Great listener",
  "Did their share",
  "Would work with again",
];

/** Open group chats — anyone verified can read and post, no pairing needed. */
export const SEED_ROOMS = [
  {
    id: "engineering",
    name: "Engineering, all campuses",
    emoji: "⚙️",
    topic: "Labs, capstones, and which lecturer actually answers emails.",
    faculty: "Engineering",
    members: 412,
    seed: [
      ["Marine Koi", "does anyone else's capstone supervisor answer emails only on fridays at 11pm"],
      ["Cobalt Lynx", "RIT here. mine answers instantly and asks for three more revisions. pick your suffering"],
      ["Amber Falcon", "MDX — we're doing a joint sustainability expo in march, cross-uni teams allowed. drop a note if you want in"],
    ],
  },
  {
    id: "law",
    name: "Law & policy",
    emoji: "⚖️",
    topic: "Contract law, moots, and the new UAE commercial amendments.",
    faculty: "Law",
    members: 168,
    seed: [
      ["Ivory Wren", "anyone actually finished the contract law reading or are we all bluffing"],
      ["Velvet Heron", "UOS moot team is looking for a partner from another uni for the friendly round"],
      ["Saffron Moth", "bluffing, respectfully"],
    ],
  },
  {
    id: "cs",
    name: "Computer science & AI",
    emoji: "🧠",
    topic: "Datasets, internships, and hackathon teams forming now.",
    faculty: "Computer Science & IT",
    members: 537,
    seed: [
      ["Indigo Heron", "BITS: we have GPU time going spare this weekend if a team needs it"],
      ["Coral Wren", "manipal → is anyone doing the DEWA internship round? interview questions?"],
      ["Cobalt Lynx", "yes. three rounds, one is a live coding thing, be ready to explain your own repo"],
    ],
  },
  {
    id: "business",
    name: "Business & startups",
    emoji: "📈",
    topic: "Case comps, pitch nights, and marketing group projects.",
    faculty: "Business & Management",
    members: 389,
    seed: [
      ["Olive Orca", "pitch night at Knowledge Park next thursday, teams of 3, two of us so far"],
      ["Saffron Fox", "amity here, I'll take the deck if someone else takes the numbers"],
    ],
  },
  {
    id: "media",
    name: "Media, film & design",
    emoji: "🎬",
    topic: "Shoots, portfolios and gear people will actually lend you.",
    faculty: "Media & Design",
    members: 244,
    seed: [
      ["Velvet Ibis", "murdoch: shooting a doc about light pollution, need a science voice on camera"],
      ["Ivory Wren", "d3 film night friday, still one spare ticket"],
    ],
  },
  {
    id: "firstyear",
    name: "First years, be honest",
    emoji: "🫧",
    topic: "The 'I know nobody yet' room. Nobody here has a group either.",
    faculty: "Everyone",
    members: 621,
    seed: [
      ["Saffron Moth", "week 6 transfer to AUS, I have eaten lunch in my car three times"],
      ["Amber Falcon", "genuinely everyone feels like this, the second years are just better at hiding it"],
      ["Coral Wren", "starting a study table thursday afternoons, anyone from academic city welcome"],
    ],
  },
] as const;

/** Recommendation pool for "people you should meet" — purpose, never photos. */
export const SEED_PEOPLE: {
  alias: string;
  university: string;
  faculty: string;
  course: string;
  year: string;
  purposes: PurposeId[];
  interests: string[];
  slots: string[];
  gender: Gender;
  reputation: string[];
  note: string;
}[] = [
  {
    alias: "Marine Koi",
    university: "University of Wollongong in Dubai",
    faculty: "Engineering",
    course: "Thermodynamics II",
    year: "Year 2",
    purposes: ["study", "coffee"],
    interests: ["Coding", "Food"],
    slots: ["Tue-pm", "Thu-pm", "Sun-am"],
    gender: "woman",
    reputation: ["Reliable collaborator", "Showed up on time"],
    note: "Wants a weekly library table, not a group chat that dies in two days.",
  },
  {
    alias: "Cobalt Lynx",
    university: "RIT Dubai",
    faculty: "Computer Science & IT",
    course: "Machine Learning",
    year: "Year 3",
    purposes: ["project", "networking"],
    interests: ["Startups", "Coding"],
    slots: ["Sat-pm", "Wed-eve", "Tue-pm"],
    gender: "man",
    reputation: ["Did their share", "Would work with again"],
    note: "Hackathon crew of three, Saturdays only, repo already set up.",
  },
  {
    alias: "Ivory Wren",
    university: "Heriot-Watt University Dubai",
    faculty: "Law",
    course: "Contract Law",
    year: "Year 1",
    purposes: ["study", "society"],
    interests: ["Debate", "Film"],
    slots: ["Mon-am", "Thu-pm", "Fri-eve"],
    gender: "woman",
    reputation: ["Great listener"],
    note: "Reading group for Contract Law — three people, one hour, no chit-chat.",
  },
  {
    alias: "Amber Falcon",
    university: "Middlesex University Dubai",
    faculty: "Business & Management",
    course: "Marketing Principles",
    year: "Year 2",
    purposes: ["project", "coffee", "networking"],
    interests: ["Design", "Startups"],
    slots: ["Tue-pm", "Wed-pm"],
    gender: "man",
    reputation: ["Reliable collaborator"],
    note: "Needs one more person for a marketing project. Has data, needs opinions.",
  },
  {
    alias: "Saffron Moth",
    university: "American University of Sharjah",
    faculty: "Sciences",
    course: "Organic Chemistry",
    year: "Year 2",
    purposes: ["coffee", "society"],
    interests: ["Reading", "Volunteering"],
    slots: ["Mon-pm", "Tue-pm", "Wed-pm"],
    gender: "undisclosed",
    reputation: ["Respectful"],
    note: "Transferred in week 6 and knows nobody. Twenty-minute walk-and-talk.",
  },
  {
    alias: "Indigo Heron",
    university: "BITS Pilani Dubai",
    faculty: "Computer Science & IT",
    course: "Data Structures",
    year: "Year 1",
    purposes: ["study", "networking"],
    interests: ["Gaming", "Coding"],
    slots: ["Tue-pm", "Thu-am", "Sat-am"],
    gender: "man",
    reputation: ["Showed up on time", "Respectful"],
    note: "Four-minute walk from Manipal and has never met anyone from it.",
  },
  {
    alias: "Velvet Ibis",
    university: "Murdoch University Dubai",
    faculty: "Media & Design",
    course: "Documentary Practice",
    year: "Year 3",
    purposes: ["project", "society"],
    interests: ["Film", "Photography"],
    slots: ["Fri-pm", "Sat-pm"],
    gender: "nonbinary",
    reputation: ["Would work with again"],
    note: "Short doc about Sharjah's night sky. Camera covered, petrol split.",
  },
  {
    alias: "Velvet Heron",
    university: "University of Sharjah",
    faculty: "Law",
    course: "UAE Commercial Law",
    year: "Postgrad",
    purposes: ["coffee", "study", "networking"],
    interests: ["Reading", "Debate"],
    slots: ["Sun-pm", "Thu-eve"],
    gender: "woman",
    reputation: ["Great listener", "Reliable collaborator"],
    note: "Postgrad cohort of nine, all with kids. Wants someone to complain about referencing with.",
  },
  {
    alias: "Coral Wren",
    university: "Manipal Academy of Higher Education Dubai",
    faculty: "Engineering",
    course: "Signals & Systems",
    year: "Year 2",
    purposes: ["study", "society", "coffee"],
    interests: ["Music", "Sports"],
    slots: ["Thu-eve", "Tue-pm", "Sat-am"],
    gender: "woman",
    reputation: ["Respectful"],
    note: "Starting a Thursday study table, Academic City, anyone welcome.",
  },
  {
    alias: "Olive Orca",
    university: "Amity University Dubai",
    faculty: "Business & Management",
    course: "Corporate Finance",
    year: "Year 4",
    purposes: ["networking", "project"],
    interests: ["Startups", "Sports"],
    slots: ["Wed-eve", "Sat-am"],
    gender: "man",
    reputation: ["Did their share"],
    note: "Case competition team, wants someone who can talk to a panel without dying.",
  },
];
