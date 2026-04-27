export default function LeadsLoading() {
  return (
    <section className="space-y-6">
      <div className="h-7 w-36 animate-pulse rounded bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
            <div className="mt-2 h-4 w-28 animate-pulse rounded bg-slate-100" />
            <div className="mt-4 h-4 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </section>
  );
}
