import Card from '../ui/Card';

export default function StatsCard({ label, value, icon, trend }) {
  const trendClass = trend?.positive ? 'text-emerald-300' : 'text-rose-300';

  return (
    <Card className="relative overflow-hidden p-5">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 via-cyan-400 to-amber-300" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[color:var(--muted)]">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">{value}</p>
          {trend ? <p className={`mt-2 text-sm ${trendClass}`}>{trend.label}</p> : null}
        </div>
        <div className="rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-3 text-[color:var(--foreground)] shadow-[0_12px_22px_-16px_rgba(255,122,26,0.9)]">
          {icon}
        </div>
      </div>
    </Card>
  );
}
