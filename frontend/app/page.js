import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <main className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-8 overflow-hidden rounded-[2rem] border border-[color:var(--surface-border)] bg-[linear-gradient(145deg,rgba(8,22,36,0.86),rgba(8,22,36,0.62))] p-8 shadow-[0_30px_90px_-44px_rgba(0,0,0,0.9)] md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div className="section-stagger space-y-6">
          <p className="brand-chip inline-flex w-fit rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-[color:var(--foreground)] backdrop-blur">
            WorkDesk CRM
          </p>
          <h1 className="font-[var(--font-display)] text-4xl font-semibold leading-tight text-[color:var(--foreground)] md:text-6xl">
            Build a sales cockpit your team actually loves opening.
          </h1>
          <p className="max-w-2xl text-lg text-[color:var(--muted)]">
            A modern operations workspace for leads, tasks, and momentum. Fast interactions, better hierarchy, and a design language built for long work sessions.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/login"
              className="gradient-primary rounded-xl px-6 py-3 font-semibold text-white shadow-[0_14px_34px_-18px_rgba(255,122,26,0.95)] transition hover:brightness-110"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-6 py-3 font-semibold text-[color:var(--foreground)] transition hover:gradient-hover"
            >
              Create Account
            </Link>
            <Link
              href="/leads"
              className="rounded-xl border border-[color:var(--surface-border)] bg-transparent px-6 py-3 font-semibold text-[color:var(--foreground)] transition hover:bg-white/8"
            >
              Open Dashboard
            </Link>
          </div>
        </div>

        <div className="glass relative overflow-hidden rounded-[1.6rem] p-6 md:p-7">
          <div className="absolute -right-14 -top-14 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(255,122,26,0.3),transparent_68%)]" />
          <div className="absolute -bottom-20 -left-16 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(36,200,219,0.26),transparent_70%)]" />
          <div className="relative z-10 space-y-4">
            <h2 className="font-[var(--font-display)] text-2xl font-semibold">Today at a glance</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Leads This Week</p>
                <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">+42</p>
              </div>
              <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Tasks Completed</p>
                <p className="mt-2 text-3xl font-semibold text-[color:var(--foreground)]">89%</p>
              </div>
            </div>
            <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Revenue trend</p>
              <div className="mt-3 flex items-end gap-2">
                {[30, 48, 40, 62, 58, 74, 66].map((bar, index) => (
                  <span
                    key={index}
                    className="w-full rounded-t-md bg-[linear-gradient(180deg,rgba(36,200,219,0.9),rgba(255,122,26,0.92))]"
                    style={{ height: `${bar}px` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}