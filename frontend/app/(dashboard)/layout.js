'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass rounded-2xl px-6 py-4 text-sm text-[color:var(--muted)]">
          Checking your session...
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter md:grid md:min-h-screen md:grid-cols-[18rem_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <Navbar />
        <main className="shell py-5">{children}</main>
      </div>

      <div className="fixed bottom-6 right-6 z-20">
        <div className="group relative">
          <button className="gradient-primary rounded-full p-4 text-white shadow-[0_18px_34px_-20px_rgba(255,122,26,0.95)] transition hover:scale-105 hover:brightness-110">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className="pointer-events-none absolute bottom-14 right-0 w-48 translate-y-2 rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface-strong)] p-2 opacity-0 shadow-lg transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
            <Link className="block rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] hover:gradient-hover" href="/leads">
              New Lead
            </Link>
            <Link className="block rounded-lg px-3 py-2 text-sm text-[color:var(--foreground)] hover:gradient-hover" href="/kanban">
              New Task
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
