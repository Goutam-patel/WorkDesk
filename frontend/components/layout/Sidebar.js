'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, KanbanSquare, Users, Command } from 'lucide-react';

const navItems = [
  {
    href: '/leads',
    label: 'Leads',
    icon: Users
  },
  {
    href: '/kanban',
    label: 'Kanban',
    icon: KanbanSquare
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('workdesk_sidebar_collapsed') === 'true';
  });

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('workdesk_sidebar_collapsed', String(next));
      return next;
    });
  }

  return (
    <aside
      className={clsx(
        'glass w-full border-r border-[color:var(--surface-border)] text-[color:var(--foreground)] transition-all duration-300 md:min-h-screen',
        collapsed ? 'md:w-[5.5rem]' : 'md:w-72'
      )}
    >
      <div className="flex items-center justify-between p-5">
        <div className={clsx('overflow-hidden transition-all', collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
          <div className="brand-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.3em] text-[color:var(--muted)]">
            <Command size={12} /> WorkDesk
          </div>
          <h2 className="mt-3 font-[var(--font-display)] text-xl font-semibold tracking-tight text-[color:var(--foreground)]">CRM OS</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">Team workspace</p>
        </div>
        <button
          className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-2 text-[color:var(--muted)] transition hover:gradient-hover hover:text-[color:var(--foreground)]"
          onClick={toggleCollapsed}
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <nav className="space-y-2 px-3 pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-[linear-gradient(135deg,rgba(255,122,26,0.18),rgba(36,200,219,0.2))] text-white shadow-[0_12px_28px_-16px_rgba(255,122,26,0.95)]'
                  : 'text-[color:var(--muted)] hover:-translate-y-0.5 hover:bg-white/5 hover:text-[color:var(--foreground)]'
              )}
            >
              {isActive ? <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-[linear-gradient(180deg,#ff7a1a,#24c8db)]" /> : null}
              <span className={clsx('transition', isActive ? 'scale-105' : 'opacity-80 group-hover:opacity-100')}>
                <Icon size={18} strokeWidth={2} />
              </span>
              <span className={clsx('transition-all', collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[color:var(--surface-border)] p-4">
        <div className={clsx('flex items-center gap-3 rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-3', collapsed && 'justify-center')}>
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(135deg,#ff7a1a,#24c8db)] text-sm font-semibold text-white shadow-[0_8px_18px_-12px_rgba(255,122,26,0.95)]">WD</div>
          <div className={clsx('min-w-0 transition-all', collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100')}>
            <p className="truncate text-sm font-medium text-[color:var(--foreground)]">Workspace Admin</p>
            <p className="truncate text-xs text-[color:var(--muted)]">Signed in</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
