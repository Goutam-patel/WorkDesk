'use client';

import { DragOverlay as DndDragOverlay } from '@dnd-kit/core';
import TaskCard from '../tasks/TaskCard';

export default function DragOverlay({ task }) {
  return (
    <DndDragOverlay>
      {task ? <TaskCard task={task} onEdit={() => {}} onDelete={() => {}} /> : null}
    </DndDragOverlay>
  );
}
