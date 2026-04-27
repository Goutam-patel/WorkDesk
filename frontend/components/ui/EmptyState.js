import Link from 'next/link';

export default function EmptyState({ title, description, actionLabel, href }) {
  return (
    <div className="glass flex min-h-56 flex-col items-center justify-center rounded-2xl px-6 py-10 text-center">
      <div className="mb-4 rounded-full border border-white/10 bg-white/5 p-4 text-slate-300">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3v18M3 12h18" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-400">{description}</p>
      {actionLabel && href ? (
        <Link
          href={href}
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-[linear-gradient(135deg,#8b5cf6,#3b82f6)] px-4 py-2 font-medium text-white transition hover:brightness-110"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
