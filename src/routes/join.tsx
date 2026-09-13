import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MistShell } from "@/components/MistShell";
import { Postmark, WaxSeal } from "@/components/Postal";
import {
  CAMPUS_PREF_LABEL,
  INTERESTS,
  UNIVERSITIES,
  UNIVERSITY_DOMAINS,
  emailMatchesUniversity,
  randomAlias,
  useMist,
  type CampusPref,
  type University,
} from "@/lib/mist-store";
import {
  ALL_SLOTS,
  COURSE_SUGGESTIONS,
  FACULTIES,
  GENDERS,
  MATCH_WITH,
  PURPOSES,
  slotLabel,
  type Gender,
  type MatchWith,
  type PurposeId,
} from "@/lib/mist-social";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Verify with your student email — Mist" },
      {
        name: "description",
        content:
          "Verify your UAE university student email to unlock anonymous pairing on Mist. Your address stays private.",
      },
      { property: "og:title", content: "Verify with your student email — Mist" },
      {
        property: "og:description",
        content: "Student email verification unlocks anonymous pairing for UAE university students.",
      },
    ],
  }),
  component: Join,
});

function Join() {
  const navigate = useNavigate();
  const { profile, saveProfile } = useMist();
  const [university, setUniversity] = useState<University>(profile?.university ?? UNIVERSITIES[0]);
  const [year, setYear] = useState(profile?.year ?? "Year 2");
  const [realName, setRealName] = useState(profile?.realName ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [email, setEmail] = useState(profile?.email ?? "");
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [codeInput, setCodeInput] = useState("");
  const [emailVerified, setEmailVerified] = useState(Boolean(profile?.email));
  const [campusPref, setCampusPref] = useState<CampusPref>(
    profile?.campusPref ?? (profile?.crossCampusOnly ? "cross" : "any"),
  );
  const [alias, setAlias] = useState("");
  const [sealed, setSealed] = useState(false);
  const [faculty, setFaculty] = useState<string>(profile?.faculty ?? FACULTIES[0]);
  const [course, setCourse] = useState(profile?.course ?? "");
  const [purposes, setPurposes] = useState<PurposeId[]>(profile?.purposes ?? []);
  const [slots, setSlots] = useState<string[]>(profile?.slots ?? []);
  const [gender, setGender] = useState<Gender>(profile?.gender ?? "undisclosed");
  const [matchWith, setMatchWith] = useState<MatchWith>(profile?.matchWith ?? "everyone");

  useEffect(() => {
    setAlias((current) => current || profile?.alias || randomAlias());
  }, [profile?.alias]);
  const [error, setError] = useState<string | null>(null);

  function sendCode() {
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("That doesn't look like an email address.");
      return;
    }
    if (!emailMatchesUniversity(value, university)) {
      setError(
        `Use your ${university} student email (ending in @${UNIVERSITY_DOMAINS[university][0]}). Personal addresses can't join Mist.`,
      );
      return;
    }
    setError(null);
    setEmailVerified(false);
    setCodeInput("");
    setSentCode(String(Math.floor(100000 + Math.random() * 900000)));
  }

  function confirmCode() {
    if (codeInput.trim() !== sentCode) {
      setError("That code doesn't match the one we sent. Check it and try again.");
      return;
    }
    setError(null);
    setEmailVerified(true);
  }

  function togglePurpose(p: PurposeId) {
    setPurposes((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  }

  function toggleSlot(s: string) {
    setSlots((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function toggleInterest(i: string) {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : prev.length >= 5 ? prev : [...prev, i],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (realName.trim().length < 2) {
      setError("Add the name you'd reveal later (2 characters or more).");
      return;
    }
    if (interests.length === 0) {
      setError("Pick at least one interest so we can match you with someone you'd click with.");
      return;
    }
    if (purposes.length === 0) {
      setError("Pick at least one reason you're here — that's what matching runs on.");
      return;
    }
    setError(null);
    saveProfile({
      alias,
      university,
      year,
      interests,
      email: email.trim().toLowerCase(),
      verified: true,
      realName: realName.trim().slice(0, 40),
      crossCampusOnly: campusPref === "cross",
      campusPref,
      faculty,
      course: course.trim().slice(0, 60),
      purposes,
      slots,
      gender,
      matchWith,
      discoverable: true,
    });
    setSealed(true);
    window.setTimeout(() => navigate({ to: "/letters" }), 1900);
  }

  if (sealed) {
    return (
      <MistShell>
        <div className="paper animate-pop relative mx-auto my-16 max-w-lg overflow-hidden rounded-[32px] p-8 text-center sm:p-12">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 [clip-path:polygon(0_0,100%_0,50%_100%)] bg-ink/5"
          />
          <Postmark
            place={university.split(" ")[0]!.toUpperCase()}
            date={new Date()
              .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
              .toUpperCase()}
            className="absolute top-5 right-5"
          />
          <WaxSeal tone="coral" size="lg" animate className="mx-auto mt-10" />
          <p className="mt-5 font-mono text-[11px] tracking-widest text-coral uppercase">
            Sealed · verified · stamped
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Welcome to the post office, {alias}.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground" role="status">
            Your student email stays private. Sorting your first letter…
          </p>
        </div>
      </MistShell>
    );
  }

  return (
    <MistShell>
      <div className="grid items-start gap-8 py-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] tracking-widest text-coral uppercase">Step 1 of 2</p>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-balance">
            One student email. That&apos;s the whole door.
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Only enrolled students have a university address, so a quick code to your campus inbox
            is all Mist needs. Your address is never shown to anyone you talk to.
          </p>
          <div className="glass mt-6 rounded-3xl p-5">
            <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
              Your mask will be
            </p>
            <p className="mt-1 text-2xl font-extrabold text-teal">{alias}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This is the only thing other students see until you reveal.
            </p>
          </div>
        </div>

        <form onSubmit={submit} className="glass rounded-[32px] p-5 sm:p-7 lg:col-span-8" noValidate>
          <fieldset>
            <legend className="text-sm font-semibold">Verify your student email (required)</legend>
            <p className="mt-1 text-xs text-muted-foreground">
              Only addresses from the ten UAE campuses can join — that&apos;s the whole door policy.
            </p>

            <label htmlFor="uni" className="mt-4 block text-sm font-semibold">
              Your university
            </label>
            <select
              id="uni"
              value={university}
              onChange={(e) => {
                setUniversity(e.target.value as University);
                setSentCode(null);
                setEmailVerified(false);
              }}
              className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
            >
              {UNIVERSITIES.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <label htmlFor="email" className="mt-4 block text-sm font-semibold">
              Student email <span className="font-normal text-muted-foreground">(optional in this demo)</span>
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailVerified(false);
                  setSentCode(null);
                }}
                placeholder={`you@${UNIVERSITY_DOMAINS[university][0]}`}
                className="flex-1 rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              />
              <button
                type="button"
                onClick={sendCode}
                disabled={emailVerified}
                className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-background disabled:opacity-50"
              >
                {sentCode ? "Resend code" : "Send code"}
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Accepted for {university}: {UNIVERSITY_DOMAINS[university].map((d) => `@${d}`).join(", ")}
            </p>

            {sentCode && !emailVerified ? (
              <div className="mt-4 rounded-3xl border-2 border-dashed border-teal/40 bg-surface/50 p-5">
                <p className="text-sm font-semibold">Enter the 6-digit code we sent to {email}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  Demo prototype — your code is{" "}
                  <span className="text-lg font-bold text-teal tracking-widest">{sentCode}</span>
                </p>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={codeInput}
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    aria-label="Verification code"
                    className="flex-1 rounded-2xl border border-line bg-card px-4 py-3 font-mono text-lg tracking-[0.4em]"
                  />
                  <button
                    type="button"
                    onClick={confirmCode}
                    className="rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-teal-foreground"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : null}

            {emailVerified ? (
              <p className="mt-4 rounded-2xl bg-mint px-4 py-3 text-sm font-semibold text-ink">
                ✓ Verified Student — {email}. Your address is never shown to anyone you talk to.
              </p>
            ) : null}
          </fieldset>


          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <label htmlFor="year" className="block text-sm font-semibold">
                Year of study
              </label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              >
                {["Foundation", "Year 1", "Year 2", "Year 3", "Year 4", "Postgraduate"].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="name" className="block text-sm font-semibold">
              Name to show if you ever reveal
            </label>
            <input
              id="name"
              value={realName}
              maxLength={40}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="e.g. Siba N."
              className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Hidden until you personally choose to lift your mask.
            </p>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Interests (pick up to 5)</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {INTERESTS.map((i) => {
                const on = interests.includes(i);
                return (
                  <button
                    type="button"
                    key={i}
                    aria-pressed={on}
                    onClick={() => toggleInterest(i)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                      on
                        ? "border-teal bg-teal text-teal-foreground"
                        : "border-line bg-card text-muted-foreground"
                    }`}
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Why are you here? (pick any)</legend>
            <p className="mt-1 text-xs text-muted-foreground">
              Matching runs on purpose first — not photos, not popularity.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {PURPOSES.map((p) => {
                const on = purposes.includes(p.id);
                return (
                  <button
                    type="button"
                    key={p.id}
                    aria-pressed={on}
                    onClick={() => togglePurpose(p.id)}
                    className={`rounded-2xl border p-3 text-left transition-transform hover:-translate-y-0.5 ${
                      on ? "border-teal bg-teal/10" : "border-line bg-card"
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {p.emoji} {p.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{p.blurb}</span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="faculty" className="block text-sm font-semibold">
                Faculty
              </label>
              <select
                id="faculty"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              >
                {FACULTIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="course" className="block text-sm font-semibold">
                Current course or module
              </label>
              <input
                id="course"
                list="course-list"
                value={course}
                maxLength={60}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Contract Law"
                className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              />
              <datalist id="course-list">
                {(COURSE_SUGGESTIONS[faculty] ?? []).map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">When are you free on campus?</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {ALL_SLOTS.map((s) => {
                const on = slots.includes(s);
                return (
                  <button
                    type="button"
                    key={s}
                    aria-pressed={on}
                    onClick={() => toggleSlot(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-transform hover:-translate-y-0.5 ${
                      on ? "border-teal bg-teal text-teal-foreground" : "border-line bg-card text-muted-foreground"
                    }`}
                  >
                    {slotLabel(s)}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="gender" className="block text-sm font-semibold">
                Gender (optional)
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              >
                {GENDERS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="matchwith" className="block text-sm font-semibold">
                I want to interact with
              </label>
              <select
                id="matchwith"
                value={matchWith}
                onChange={(e) => setMatchWith(e.target.value as MatchWith)}
                className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              >
                {MATCH_WITH.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Changeable any time under Safety. Romantic or sexual solicitation is banned outright.
              </p>
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Who can you be paired with?</legend>
            <p className="mt-1 text-xs text-muted-foreground">
              Mist is inter-campus by default — all ten universities share one pool.
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {(Object.keys(CAMPUS_PREF_LABEL) as CampusPref[]).map((k) => {
                const on = campusPref === k;
                return (
                  <button
                    type="button"
                    key={k}
                    aria-pressed={on}
                    onClick={() => setCampusPref(k)}
                    className={`rounded-2xl border p-3 text-left transition-transform hover:-translate-y-0.5 ${
                      on ? "border-teal bg-teal/10" : "border-line bg-card"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{CAMPUS_PREF_LABEL[k].title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {CAMPUS_PREF_LABEL[k].body}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error ? (
            <p role="alert" className="mt-5 rounded-2xl bg-coral/15 px-4 py-3 text-sm text-ink">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-[42ch] text-xs text-muted-foreground">
              First messages are the hardest part of meeting someone new — starting anonymous
              removes that pressure, while university email verification means you&apos;re never
              actually talking to a stranger.
            </p>
            <button
              type="submit"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              Verify &amp; meet my pen pal
            </button>
          </div>
        </form>
      </div>
    </MistShell>
  );
}
