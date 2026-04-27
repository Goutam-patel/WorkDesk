import clsx from 'clsx';

export function H1({ children, className }) {
  return <h1 className={clsx('font-[var(--font-display)] text-4xl font-semibold tracking-tight text-[color:var(--foreground)] md:text-5xl', className)}>{children}</h1>;
}

export function H2({ children, className }) {
  return <h2 className={clsx('font-[var(--font-display)] text-2xl font-semibold tracking-tight text-[color:var(--foreground)]', className)}>{children}</h2>;
}

export function H3({ children, className }) {
  return <h3 className={clsx('font-[var(--font-display)] text-xl font-semibold tracking-tight text-[color:var(--foreground)]', className)}>{children}</h3>;
}

export function Body({ children, className }) {
  return <p className={clsx('text-base leading-7 text-[color:var(--muted)]', className)}>{children}</p>;
}

export function Small({ children, className }) {
  return <p className={clsx('text-sm text-[color:var(--muted)]', className)}>{children}</p>;
}

export function Code({ children, className }) {
  return <code className={clsx('rounded-md border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-2 py-1 font-mono text-sm text-[color:var(--foreground)]', className)}>{children}</code>;
}
