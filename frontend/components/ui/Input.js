import clsx from 'clsx';

export default function Input({ label, error, helperText, leftIcon, rightIcon, className, ...props }) {
  return (
    <label className="flex w-full flex-col gap-2 text-sm text-[color:var(--foreground)]">
      {label ? <span className="font-semibold tracking-tight text-[color:var(--foreground)]">{label}</span> : null}
      <div className="relative">
        {leftIcon ? <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">{leftIcon}</span> : null}
        <input
          className={clsx(
            'w-full rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2.5 text-[color:var(--foreground)] outline-none transition-smooth placeholder:text-[color:var(--muted)] focus:border-[color:var(--brand)] focus-ring',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error && 'border-[color:var(--danger)]',
            className
          )}
          {...props}
        />
        {rightIcon ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--muted)]">{rightIcon}</span> : null}
      </div>
      {helperText ? <span className="text-xs text-[color:var(--muted)]">{helperText}</span> : null}
      {error ? <span className="text-xs text-[color:var(--danger)]">{error}</span> : null}
    </label>
  );
}
