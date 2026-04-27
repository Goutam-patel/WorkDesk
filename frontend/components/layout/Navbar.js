'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Dropdown from '../ui/Dropdown';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { Bell, Command, Search } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'system';
    }
    return localStorage.getItem('workdesk_theme') || 'system';
  });
  const [searchOpen, setSearchOpen] = useState(false);

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) {
      return ['Dashboard'];
    }

    return ['Dashboard', ...parts.map((part) => part.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))];
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem('workdesk_theme', theme);
  }, [theme]);

  useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  async function handleLogout() {
    await logout();
  }

  return (
    <>
      <header
        className={`sticky top-0 z-20 mx-3 mt-3 rounded-2xl border border-[color:var(--surface-border)] px-4 py-3 transition md:mx-4 ${isScrolled ? 'glass' : 'bg-transparent'}`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="brand-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.22em] text-[color:var(--muted)]">
              <Command size={12} /> WorkDesk
            </div>
            <p className="mt-2 font-[var(--font-display)] text-sm font-semibold text-[color:var(--foreground)]">{breadcrumbs.join(' / ')}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--muted)] transition hover:gradient-hover hover:text-[color:var(--foreground)]"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={16} /> Search <span className="rounded-md border border-[color:var(--surface-border)] bg-white/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wider">Cmd+K</span>
            </button>
            <button className="relative rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-2 text-[color:var(--muted)] transition hover:gradient-hover hover:text-[color:var(--foreground)]" aria-label="Notifications">
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[color:var(--danger)] shadow-glow" />
            </button>
            <select
              className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-2 py-2 text-sm text-[color:var(--foreground)]"
              value={theme}
              onChange={(event) => setTheme(event.target.value)}
              aria-label="Theme switcher"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
            <Dropdown
              label={user?.name || 'Profile'}
              items={[
                { label: user?.email || 'Signed in' },
                { kind: 'divider' },
                { label: 'Logout', onClick: handleLogout, tone: 'danger' }
              ]}
            />
          </div>
        </div>
      </header>

      {searchOpen ? (
        <div className="fixed inset-0 z-30 bg-black/70 p-4 backdrop-blur-md" onClick={() => setSearchOpen(false)}>
          <div className="mx-auto mt-20 max-w-xl rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface-strong)] p-4 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <h3 className="font-[var(--font-display)] text-sm font-semibold text-[color:var(--foreground)]">Global Search</h3>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Quick jump shortcuts</p>
            <div className="mt-3 space-y-2">
              <Button className="w-full justify-start" variant="secondary" onClick={() => (window.location.href = '/leads')}>
                Go to Leads
              </Button>
              <Button className="w-full justify-start" variant="secondary" onClick={() => (window.location.href = '/kanban')}>
                Go to Kanban
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
