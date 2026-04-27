'use client';

import { useMemo, useState } from 'react';
import { TASK_STATUS_OPTIONS } from '../lib/constants/statuses';
import { getStatusFromDropTarget, groupByStatus, moveItemForDrop, moveItemStatus } from '../lib/kanban/utils';

const statusKeys = TASK_STATUS_OPTIONS.map((status) => status.value);

export function useKanban({ tasks, setTasks, updateTaskItem, setError }) {
  const [activeId, setActiveId] = useState(null);
  const [dragSnapshot, setDragSnapshot] = useState(null);
  const [originStatus, setOriginStatus] = useState(null);

  const groupedTasks = useMemo(() => groupByStatus(tasks, statusKeys), [tasks]);
  const activeTask = useMemo(
    () => tasks.find((task) => String(task._id) === String(activeId)) || null,
    [tasks, activeId]
  );

  function handleDragStart(event) {
    const nextActiveId = event.active?.id || null;
    setActiveId(nextActiveId);

    const task = tasks.find((item) => String(item._id) === String(nextActiveId));
    setOriginStatus(task?.status || null);
    setDragSnapshot(tasks);
  }

  function handleDragOver(event) {
    const activeTaskId = String(event.active?.id || '');
    const overId = event.over?.id;

    if (!activeTaskId || !overId) {
      return;
    }

    setTasks((prev) => moveItemForDrop(prev, activeTaskId, overId, statusKeys));
  }

  async function handleDragEnd(event) {
    const activeTaskId = String(event.active?.id || '');
    const overId = event.over?.id;
    setActiveId(null);

    if (!activeTaskId || !overId) {
      if (dragSnapshot) {
        setTasks(dragSnapshot);
      }
      setDragSnapshot(null);
      setOriginStatus(null);
      return;
    }

    const task = tasks.find((item) => String(item._id) === activeTaskId);
    if (!task) {
      setDragSnapshot(null);
      setOriginStatus(null);
      return;
    }

    const nextStatus = getStatusFromDropTarget(overId, tasks, statusKeys) || task.status;
    if (!nextStatus || nextStatus === originStatus) {
      setDragSnapshot(null);
      setOriginStatus(null);
      return;
    }

    try {
      await updateTaskItem(activeTaskId, { status: nextStatus });
    } catch (requestError) {
      if (dragSnapshot) {
        setTasks(dragSnapshot);
      } else {
        setTasks((prev) => moveItemStatus(prev, activeTaskId, originStatus || task.status));
      }
      if (setError) {
        setError(requestError.response?.data?.message || 'Unable to update task status');
      }
    } finally {
      setDragSnapshot(null);
      setOriginStatus(null);
    }
  }

  function handleDragCancel() {
    setActiveId(null);
    if (dragSnapshot) {
      setTasks(dragSnapshot);
    }
    setDragSnapshot(null);
    setOriginStatus(null);
  }

  return {
    groupedTasks,
    activeId,
    activeTask,
    statusKeys,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel
  };
}
