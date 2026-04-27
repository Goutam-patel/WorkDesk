export default function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="glass animate-fadeIn flex min-h-40 items-center justify-center rounded-2xl p-8 text-sm text-slate-300">
      <div className="flex items-center gap-3">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <span>{label}</span>
      </div>
    </div>
  );
}
