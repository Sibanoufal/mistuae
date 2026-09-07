import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMist } from "@/lib/mist-store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/match", label: "Match" },
  { to: "/boards", label: "Boards" },
  { to: "/problem-solution", label: "Problem & Solution" },
] as const;

export function CausticBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="caustic-blob absolute -top-16 -left-16 size-[520px] rounded-full bg-teal/15 blur-3xl" />
      <div className="caustic-blob absolute top-1/3 -right-24 size-[460px] rounded-full bg-aqua/25 blur-3xl" />
      <div className="caustic-blob absolute bottom-0 left-1/4 size-[380px] rounded-full bg-coral/10 blur-3xl" />
    </div>
  );
}

export function MistShell({ children }: { children: ReactNode }) {
  const { profile } = useMist();

  return (
    <div className="relative min-h-screen bg-background text-ink">
      <CausticBackdrop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
      >
        Skip to content
      </a>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <header>
          <nav aria-label="Main" className="flex flex-wrap items-center justify-between gap-3 py-5">
            <Link to="/" className="flex items-center gap-2" aria-label="Mist home">
              <span className="grid size-9 place-items-center rounded-2xl bg-ink font-bold text-background">
                M
              </span>
              <span className="text-lg font-extrabold tracking-tight">Mist</span>
              <span className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                UAE
              </span>
            </Link>

            <ul className="order-3 flex w-full items-center gap-1 overflow-x-auto text-sm font-medium text-muted-foreground md:order-none md:w-auto md:gap-6 md:overflow-visible">
              {NAV.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="inline-block rounded-full px-3 py-1.5 whitespace-nowrap transition-colors hover:bg-ink/5 hover:text-ink"
                    activeProps={{ className: "bg-ink/8 text-ink" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {profile ? (
              <Link
                to="/threads"
                className="flex items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
              >
                <span className="grid size-7 place-items-center rounded-full bg-teal font-mono text-[10px] text-teal-foreground">
                  {profile.alias
                    .split(" ")
                    .map((w) => w[0])
                    .join("")}
                </span>
                {profile.alias}
              </Link>
            ) : (
              <Link
                to="/join"
                className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
              >
                Join the pool
              </Link>
            )}
          </nav>
        </header>

        <main id="main">{children}</main>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line py-8 sm:flex-row">
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Mist — verified students only · UAE
          </p>
          <p className="text-sm text-muted-foreground">Anonymity first. Reveal at your own pace.</p>
        </footer>
      </div>
    </div>
  );
}
