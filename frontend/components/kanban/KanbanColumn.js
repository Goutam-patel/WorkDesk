'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import clsx from 'clsx';

export default function KanbanColumn({ status, title, cards, renderCard, wipLimit, collapsed, onToggleCollapse }) {
  const { setNodeRef, isOver } = useDroppable({
    id: status
  });

  const count = cards.length;
  const isAtLimit = Number.isFinite(wipLimit) && wipLimit > 0 && count >= wipLimit;
  const isNearLimit = Number.isFinite(wipLimit) && wipLimit > 0 && count === wipLimit - 1;

  let surfaceClass = 'border-[color:var(--surface-border)] bg-[color:var(--surface)]';
  if (isAtLimit) {
    surfaceClass = 'border-rose-400/60 bg-rose-500/10';
  } else if (isNearLimit) {
    surfaceClass = 'border-amber-300/60 bg-amber-500/10';
  }

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'glass flex w-[320px] shrink-0 flex-col rounded-2xl border p-3 transition-smooth',
        isOver ? 'border-[color:var(--brand)] shadow-[0_14px_26px_-18px_rgba(255,122,26,0.9)]' : surfaceClass
      )}
    >
      <div className="mb-3 flex items-center justify-between rounded-2xl border border-[color:var(--surface-border)] bg-[linear-gradient(135deg,rgba(255,122,26,0.14),rgba(36,200,219,0.12))] px-3 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[linear-gradient(135deg,#ff7a1a,#24c8db)] shadow-[0_8px_12px_-8px_rgba(255,122,26,0.95)]" />
          <h3 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wide text-[color:var(--foreground)]">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-xs ${isAtLimit ? 'bg-rose-500/15 text-rose-200' : isNearLimit ? 'bg-amber-500/15 text-amber-200' : 'bg-white/10 text-[color:var(--foreground)]'}`}
          >
            {wipLimit && wipLimit < 900 ? `${count}/${wipLimit}` : count}
          </span>
          <button
            className="rounded-lg border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-1 text-[color:var(--muted)] transition hover:gradient-hover hover:text-[color:var(--foreground)]"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand column' : 'Collapse column'}
          >
            {collapsed ? '→' : '←'}
          </button>
        </div>
      </div>
      {isAtLimit ? <p className="mb-3 text-xs text-rose-300">WIP limit reached for this column.</p> : null}
      {!collapsed ? (
        <SortableContext items={cards.map((item) => String(item._id))} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[color:var(--surface-border)] bg-[color:var(--surface)] p-5 text-center text-xs text-[color:var(--muted)]">
              <p className="mb-1">Drop a task here</p>
              <p>or create a new card for this stage.</p>
            </div>
          ) : (
            <div className="space-y-3">{cards.map((card) => renderCard(card))}</div>
          )}
        </SortableContext>
      ) : (
        <p className="rounded-xl border border-dashed border-[color:var(--surface-border)] bg-[color:var(--surface)] p-3 text-center text-xs text-[color:var(--muted)]">Column collapsed</p>
      )}
    </div>
  );
}
