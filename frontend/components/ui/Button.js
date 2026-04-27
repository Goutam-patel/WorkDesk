import clsx from 'clsx';

const variants = {
  primary: 'gradient-primary text-white shadow-[0_12px_28px_-14px_rgba(255,122,26,0.9)] hover:brightness-110',
  secondary: 'border border-[color:var(--surface-border)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:gradient-hover',
  ghost: 'bg-transparent text-[color:var(--foreground)] hover:bg-white/8',
  danger: 'bg-[linear-gradient(135deg,rgba(239,68,68,0.95),rgba(190,18,60,0.95))] text-white shadow-lg hover:brightness-110',
  icon: 'rounded-full bg-white/5 p-2 text-white hover:bg-white/10'
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  className,
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'group relative inline-flex items-center justify-center overflow-hidden rounded-xl px-4 py-2 font-semibold tracking-tight transition-smooth focus-visible:focus-ring active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className
      )}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Please wait...
        </span>
      ) : (
        <>
          <span className="relative z-10">{children}</span>
          {variant === 'primary' ? (
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/18 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          ) : null}
        </>
      )}
    </button>
  );
}
