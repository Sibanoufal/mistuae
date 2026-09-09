import type { ReactNode } from "react";

const SEAL_BG = {
  coral: "bg-coral text-coral-foreground",
  teal: "bg-teal text-teal-foreground",
  lilac: "bg-lilac text-lilac-foreground",
  butter: "bg-butter text-butter-foreground",
  ink: "bg-ink text-background",
} as const;

export type SealTone = keyof typeof SEAL_BG;

/** Small wax-seal disc used anywhere a moment is "sealed". */
export function WaxSeal({
  tone = "coral",
  size = "md",
  label = "M",
  animate = false,
  className = "",
}: {
  tone?: SealTone;
  size?: "sm" | "md" | "lg";
  label?: ReactNode;
  animate?: boolean;
  className?: string;
}) {
  const dim = size === "sm" ? "size-6 text-[8px]" : size === "lg" ? "size-14 text-base" : "size-10 text-xs";
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-full font-mono sticker ${dim} ${SEAL_BG[tone]} ${
        animate ? "animate-seal" : ""
      } ${className}`}
    >
      {label}
    </span>
  );
}

/** Circular postmark stamp — date + place, rotated like a real ink mark. */
export function Postmark({
  place,
  date,
  className = "",
}: {
  place: string;
  date: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-[86px] shrink-0 -rotate-12 place-items-center rounded-full border-2 border-dashed border-coral/60 text-center font-mono text-[8px] leading-tight tracking-widest text-coral/80 uppercase ${className}`}
    >
      <span className="px-1">
        {place}
        <span className="my-0.5 block h-px bg-coral/40" />
        {date}
        <span className="mt-0.5 block text-[7px]">Mist · UAE</span>
      </span>
    </span>
  );
}

/** Perforated postage stamp with a big glyph — the app-wide "authored" mark. */
export function PostageStamp({
  glyph,
  caption,
  tint = "bg-butter",
  className = "",
}: {
  glyph: ReactNode;
  caption: string;
  tint?: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-grid place-items-center rounded-md border-2 border-dotted border-paper-line p-2 text-center ${tint} ${className}`}
    >
      <span aria-hidden="true" className="text-2xl leading-none">
        {glyph}
      </span>
      <span className="mt-1 font-mono text-[8px] tracking-widest uppercase opacity-70">{caption}</span>
    </span>
  );
}
