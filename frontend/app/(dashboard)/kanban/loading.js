export default function KanbanLoading() {
  return (
    <section className="space-y-6">
      <div className="h-7 w-48 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-3 h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="space-y-3">
              <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
