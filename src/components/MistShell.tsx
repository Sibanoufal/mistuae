import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useMist } from "@/lib/mist-store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/letters", label: "Letters" },
  { to: "/match", label: "Match" },
  { to: "/discover", label: "Discover" },
  { to: "/rooms", label: "Rooms" },
  { to: "/boards", label: "Boards" },
  { to: "/settings", label: "Safety" },
  { to: "/problem-solution", label: "Problem & Solution" },
] as const;

export function CausticBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="caustic-blob absolute -top-24 -left-20 size-[420px] rounded-full bg-teal/20 blur-3xl sm:size-[560px]" />
      <div className="caustic-blob absolute top-1/4 -right-28 size-[380px] rounded-full bg-lilac/30 blur-3xl [animation-delay:-4s] sm:size-[520px]" />
      <div className="caustic-blob absolute bottom-10 left-1/3 size-[320px] rounded-full bg-butter/50 blur-3xl [animation-delay:-8s] sm:size-[440px]" />
      <div className="caustic-blob absolute -bottom-24 -right-10 size-[300px] rounded-full bg-coral/20 blur-3xl [animation-delay:-2s] sm:size-[400px]" />
    </div>
  );
}

export function MistShell({ children }: { children: ReactNode }) {
  const { profile, letters } = useMist();
  const unread = letters.filter((l) => !l.fromMe && !l.read).length;

  return (
    <div className="relative min-h-screen bg-background text-ink">
      <CausticBackdrop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-background"
      >
        Skip to content
      </a>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8">
        <header>
          <nav
            aria-label="Main"
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-3 py-4 sm:py-5 md:flex md:justify-between"
          >
            <Link to="/" className="flex min-w-0 items-center gap-2" aria-label="Mist home">
              <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-teal via-lilac to-coral font-bold text-background">
                M
              </span>
              <span className="truncate text-lg font-extrabold tracking-tight">Mist</span>
              <span className="mt-1 hidden font-mono text-[10px] tracking-widest text-muted-foreground uppercase sm:inline">
                UAE · 10 campuses
              </span>
            </Link>

            <ul className="order-3 col-span-2 -mx-4 flex items-center gap-1 overflow-x-auto px-4 pb-1 text-sm font-medium text-muted-foreground [scrollbar-width:none] md:order-none md:col-auto md:mx-0 md:gap-2 md:overflow-visible md:px-0 md:pb-0">
              {NAV.map((item) => (
                <li key={item.to} className="shrink-0">
                  <Link
                    to={item.to}
                    className="relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 whitespace-nowrap transition-colors hover:bg-ink/5 hover:text-ink"
                    activeProps={{ className: "bg-ink text-background hover:bg-ink hover:text-background" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                    {item.to === "/letters" && unread > 0 ? (
                      <span className="grid size-4 place-items-center rounded-full bg-coral font-mono text-[9px] text-coral-foreground">
                        {unread}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            {profile ? (
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  to="/threads"
                  className="flex shrink-0 items-center gap-2 rounded-full border border-line bg-card px-2.5 py-1.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 sm:px-3"
                >
                  <span className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-teal to-lilac font-mono text-[10px] text-teal-foreground">
                    {profile.alias
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </span>
                  <span className="hidden sm:inline">{profile.alias}</span>
                </Link>
                <Link
                  to="/join"
                  className="hidden shrink-0 rounded-full bg-butter px-3 py-1.5 font-mono text-[10px] tracking-widest text-butter-foreground uppercase transition-transform hover:-translate-y-0.5 lg:inline-block"
                >
                  Demo account · edit
                </Link>
              </div>
            ) : (
              <Link
                to="/join"
                className="shrink-0 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-background transition-transform hover:-translate-y-0.5 sm:px-5"
              >
                Join the pool
              </Link>
            )}
          </nav>
        </header>

        <main id="main">{children}</main>

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line py-8 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Mist — verified students only · 10 UAE campuses
          </p>
          <p className="text-sm text-muted-foreground">Anonymity first. Reveal at your own pace.</p>
        </footer>
      </div>
    </div>
  );
}
