import Card from '../ui/Card';

function Bar({ value, className }) {
  return <div className={`rounded-t-md ${className}`} style={{ height: `${value}%` }} />;
}

export default function ChartCard({ title, subtitle, bars = [], legend = [] }) {
  return (
    <Card className="p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[color:var(--muted)]">{subtitle}</p>
          <h3 className="font-[var(--font-display)] text-xl font-semibold text-[color:var(--foreground)]">{title}</h3>
        </div>
        <button className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-medium text-[color:var(--foreground)] transition hover:gradient-hover">
          Export
        </button>
      </div>
      <div className="flex h-48 items-end gap-3 rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-4">
        {bars.map((bar, index) => (
          <div key={`${bar.label}-${index}`} className="flex flex-1 flex-col items-center gap-2">
            <Bar value={bar.value} className={bar.className || 'bg-gradient-to-t from-orange-500 to-cyan-400'} />
            <span className="text-xs text-[color:var(--muted)]">{bar.label}</span>
          </div>
        ))}
      </div>
      {legend.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-[color:var(--muted)]">
          {legend.map((item) => (
            <span key={item.label} className="inline-flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${item.dotClass || 'bg-orange-500'}`} />
              {item.label}
            </span>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
