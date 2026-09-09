import { UNIVERSITIES, UNIVERSITY_SHORT, type University } from "@/lib/mist-store";

/**
 * Computed orbit: your campus sits in the middle, the other nine orbit it.
 * Ring distance is derived from real activity (letters exchanged, open threads,
 * board invites answered) so the picture changes as the student uses Mist.
 */
export function CampusOrbit({
  home,
  activeCampuses,
  penPalCampus,
  letters,
  threads,
}: {
  home: University | null;
  activeCampuses: University[];
  penPalCampus: University | null;
  letters: number;
  threads: number;
}) {
  const size = 260;
  const c = size / 2;
  const others = UNIVERSITIES.filter((u) => u !== home);
  const pull = Math.min(1, (letters * 0.12 + threads * 0.18) / 2);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`Orbit map: ${home ?? "you"} at the centre with ${activeCampuses.length} campuses you have connected with pulled closer.`}
      className="mx-auto h-auto w-full max-w-[300px]"
    >
      {[112, 84, 56].map((r) => (
        <circle
          key={r}
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.14}
          strokeDasharray="2 5"
        />
      ))}

      {others.map((u, i) => {
        const angle = (i / others.length) * Math.PI * 2 - Math.PI / 2;
        const active = activeCampuses.includes(u);
        const isPal = u === penPalCampus;
        const base = 112;
        const r = isPal ? base - 56 * pull - 14 : active ? base - 34 * pull : base;
        const x = c + Math.cos(angle) * r;
        const y = c + Math.sin(angle) * r;
        return (
          <g key={u} style={{ transition: "all 600ms cubic-bezier(0.32,0.72,0,1)" }}>
            {active || isPal ? (
              <line
                x1={c}
                y1={c}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeOpacity={isPal ? 0.55 : 0.22}
                strokeWidth={isPal ? 1.6 : 1}
                strokeDasharray={isPal ? undefined : "3 4"}
              />
            ) : null}
            <circle
              cx={x}
              cy={y}
              r={isPal ? 15 : active ? 13 : 11}
              className={isPal ? "fill-coral" : active ? "fill-teal" : "fill-current"}
              fillOpacity={isPal || active ? 1 : 0.12}
            />
            <text
              x={x}
              y={y + 3}
              textAnchor="middle"
              className="font-mono"
              fontSize="7"
              fill={isPal || active ? "white" : "currentColor"}
              fillOpacity={isPal || active ? 1 : 0.75}
            >
              {UNIVERSITY_SHORT[u].slice(0, 4)}
            </text>
          </g>
        );
      })}

      <circle cx={c} cy={c} r={26} className="fill-ink" />
      <text x={c} y={c + 3} textAnchor="middle" fontSize="9" className="font-mono" fill="white">
        {home ? UNIVERSITY_SHORT[home].slice(0, 5) : "you"}
      </text>
    </svg>
  );
}
