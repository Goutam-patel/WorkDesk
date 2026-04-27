'use client';

import { DndContext } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import DragOverlay from './DragOverlay';
import { TASK_STATUS_OPTIONS, TASK_WIP_LIMITS } from '../../lib/constants/statuses';
import { kanbanCollisionDetection, useKanbanSensors } from '../../lib/kanban/dndConfig';

export default function KanbanBoard({
  groupedTasks,
  activeTask,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
  onEditTask,
  onDeleteTask,
  collapsedColumns,
  onToggleColumn,
  viewMode
}) {
  const sensors = useKanbanSensors();

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {TASK_STATUS_OPTIONS.map((statusOption) => {
          const rows = groupedTasks[statusOption.value] || [];
          return (
            <div key={statusOption.value} className="glass rounded-2xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{statusOption.label}</h3>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-slate-200">{rows.length}</span>
              </div>
              {rows.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-slate-400">
                  No tasks in this stage.
                </div>
              ) : (
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {rows.map((task) => (
                    <KanbanCard key={task._id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  if (viewMode === 'calendar') {
    return (
      <div className="glass rounded-2xl p-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/5 text-white shadow-glow">
          <span>•</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Calendar view coming online</h3>
        <p className="mt-2 text-sm text-slate-400">
          The board is ready for a timeline scheduling surface in the next iteration.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={kanbanCollisionDetection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <div className="custom-scrollbar flex gap-4 overflow-x-auto pb-2">
        {TASK_STATUS_OPTIONS.map((statusOption) => (
          <KanbanColumn
            key={statusOption.value}
            status={statusOption.value}
            title={statusOption.label}
            cards={groupedTasks[statusOption.value] || []}
            wipLimit={TASK_WIP_LIMITS[statusOption.value]}
            collapsed={Boolean(collapsedColumns?.[statusOption.value])}
            onToggleCollapse={() => onToggleColumn?.(statusOption.value)}
            renderCard={(task) => (
              <KanbanCard key={task._id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
            )}
          />
        ))}
      </div>
      <DragOverlay task={activeTask} />
    </DndContext>
  );
}
