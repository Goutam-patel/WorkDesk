import clsx from 'clsx';

export default function Card({ children, className }) {
  return (
    <div
      className={clsx(
        'glass relative overflow-hidden rounded-2xl p-4 transition-smooth hover:-translate-y-0.5 hover:shadow-[0_28px_70px_-34px_rgba(0,0,0,0.85)] before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-20 before:bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)]',
        className
      )}
    >
      {children}
    </div>
  );
}
