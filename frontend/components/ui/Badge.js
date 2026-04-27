import clsx from 'clsx';

const tones = {
  neutral: 'bg-white/6 text-slate-200 border-white/10',
  info: 'bg-blue-500/15 text-blue-200 border-blue-400/20',
  success: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/20',
  warning: 'bg-amber-500/15 text-amber-200 border-amber-400/20',
  danger: 'bg-rose-500/15 text-rose-200 border-rose-400/20'
};

export default function Badge({ children, tone = 'neutral' }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium backdrop-blur', tones[tone] || tones.neutral)}>
      {children}
    </span>
  );
}
