import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MistShell } from "@/components/MistShell";
import {
  INTERESTS,
  UNIVERSITIES,
  randomAlias,
  useMist,
  type University,
} from "@/lib/mist-store";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Verify with your student ID — Mist" },
      {
        name: "description",
        content:
          "Upload your UAE university student ID photo to unlock anonymous pairing on Mist. Your ID stays private on your device.",
      },
      { property: "og:title", content: "Verify with your student ID — Mist" },
      {
        property: "og:description",
        content: "Student ID verification unlocks anonymous pairing for UAE university students.",
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
  const [photoName, setPhotoName] = useState(profile?.idPhotoName ?? "");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [crossCampusOnly, setCrossCampusOnly] = useState(profile?.crossCampusOnly ?? false);
  const [alias, setAlias] = useState("");

  useEffect(() => {
    setAlias((current) => current || profile?.alias || randomAlias());
  }, [profile?.alias]);
  const [error, setError] = useState<string | null>(null);

  function onPhoto(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file isn't an image. Please upload a photo of your student ID.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError("That image is over 6 MB. Please upload a smaller photo.");
      return;
    }
    setError(null);
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function toggleInterest(i: string) {
    setInterests((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : prev.length >= 5 ? prev : [...prev, i],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoName) {
      setError("A student ID photo is required — it's how we keep Mist students-only.");
      return;
    }
    if (realName.trim().length < 2) {
      setError("Add the name you'd reveal later (2 characters or more).");
      return;
    }
    if (interests.length === 0) {
      setError("Pick at least one interest so we can match you with someone you'd click with.");
      return;
    }
    setError(null);
    saveProfile({
      alias,
      university,
      year,
      interests,
      idPhotoName: photoName,
      verified: true,
      realName: realName.trim().slice(0, 40),
      crossCampusOnly,
    });
    navigate({ to: "/match" });
  }

  return (
    <MistShell>
      <div className="grid items-start gap-8 py-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="font-mono text-[11px] tracking-widest text-coral uppercase">Step 1 of 2</p>
          <h1 className="mt-3 text-4xl leading-tight font-extrabold tracking-tight text-balance">
            The only thing you upload is proof you&apos;re a student.
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Snap your university ID, pick your campus, and Mist keeps it behind the mask. Nobody you
            chat with ever sees it.
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
            <legend className="text-sm font-semibold">Student ID photo (required)</legend>
            <label className="mt-3 flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-teal/40 bg-surface/50 p-6 text-center transition-colors hover:bg-surface">
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Preview of the student ID you uploaded"
                  className="max-h-40 rounded-2xl object-contain"
                />
              ) : (
                <span aria-hidden="true" className="text-3xl">
                  🪪
                </span>
              )}
              <span className="text-sm font-semibold text-teal">
                {photoName ? `Selected: ${photoName} — change photo` : "Upload your student ID photo"}
              </span>
              <span className="text-xs text-muted-foreground">
                Stored only on this device · never shown to your match
              </span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => onPhoto(e.target.files?.[0])}
              />
            </label>
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="uni" className="block text-sm font-semibold">
                Your university
              </label>
              <select
                id="uni"
                value={university}
                onChange={(e) => setUniversity(e.target.value as University)}
                className="mt-2 w-full rounded-2xl border border-line bg-card px-4 py-3 text-sm"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
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

          <label className="mt-6 flex items-start gap-3 rounded-2xl bg-surface/60 p-4 text-sm">
            <input
              type="checkbox"
              checked={crossCampusOnly}
              onChange={(e) => setCrossCampusOnly(e.target.checked)}
              className="mt-0.5 size-4 accent-teal"
            />
            <span>
              <strong>Match me outside my own university.</strong>
              <span className="block text-muted-foreground">
                Useful if you&apos;d rather not bump into your match in the cafeteria tomorrow.
              </span>
            </span>
          </label>

          {error ? (
            <p role="alert" className="mt-5 rounded-2xl bg-coral/15 px-4 py-3 text-sm text-ink">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="max-w-[42ch] text-xs text-muted-foreground">
              By continuing you confirm this ID is yours. You stay anonymous until you decide
              otherwise.
            </p>
            <button
              type="submit"
              className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
            >
              Verify &amp; continue to matching
            </button>
          </div>
        </form>
      </div>
    </MistShell>
  );
}
