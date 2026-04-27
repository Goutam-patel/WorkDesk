'use client';

import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import KanbanBoard from '../../../components/kanban/KanbanBoard';
import TaskModal from '../../../components/tasks/TaskModal';
import { useKanban } from '../../../hooks/useKanban';
import { useTasks } from '../../../hooks/useTasks';
import { TASK_STATUS_OPTIONS } from '../../../lib/constants/statuses';
import { Plus } from 'lucide-react';

export default function KanbanPage() {
  const {
    tasks,
    setTasks,
    loading,
    submitting,
    error,
    setError,
    createTaskItem,
    updateTaskItem,
    deleteTaskItem
  } = useTasks();
  const {
    groupedTasks,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel
  } = useKanban({
    tasks,
    setTasks,
    updateTaskItem,
    setError
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('kanban');
  const [collapsedColumns, setCollapsedColumns] = useState({});

  const visibleGroupedTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = {};

    TASK_STATUS_OPTIONS.forEach((status) => {
      const list = groupedTasks[status.value] || [];
      filtered[status.value] = list.filter((task) => {
        const matchesQuery = !q || task.title.toLowerCase().includes(q) || (task.description || '').toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesQuery && matchesStatus;
      });
    });

    return filtered;
  }, [groupedTasks, query, statusFilter]);

  function openCreateModal() {
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  async function handleSubmitTask(payload) {
    setError('');
    try {
      if (editingTask) {
        await updateTaskItem(editingTask._id, payload);
      } else {
        await createTaskItem(payload);
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save task');
    }
  }

  async function handleDeleteTask(id) {
    setError('');
    try {
      await deleteTaskItem(id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to delete task');
    }
  }

  function handleToggleColumn(status) {
    setCollapsedColumns((prev) => ({
      ...prev,
      [status]: !prev[status]
    }));
  }

  return (
    <section className="section-stagger space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">Kanban</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Drag cards between columns to update task statuses instantly.</p>
        </div>
        <Button onClick={openCreateModal}>
          <span className="inline-flex items-center gap-2"><Plus size={16} /> Create Task</span>
        </Button>
      </div>

      <div className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-[1fr_auto_auto]">
        <input
          className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted)]"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search tasks by title or description"
        />
        <select
          className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All statuses</option>
          {TASK_STATUS_OPTIONS.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        <div className="flex rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] p-1">
          {['kanban', 'list', 'calendar'].map((mode) => (
            <button
              key={mode}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium uppercase tracking-wide transition ${
                viewMode === mode ? 'bg-[linear-gradient(135deg,#ff7a1a,#24c8db)] text-white shadow-[0_10px_18px_-14px_rgba(255,122,26,0.95)]' : 'text-[color:var(--muted)] hover:text-[color:var(--foreground)]'
              }`}
              onClick={() => setViewMode(mode)}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}

      {loading ? <p className="glass w-fit rounded-xl px-4 py-2 text-sm text-[color:var(--muted)]">Loading tasks...</p> : null}

      <KanbanBoard
        groupedTasks={visibleGroupedTasks}
        activeTask={activeTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
        onEditTask={openEditModal}
        onDeleteTask={handleDeleteTask}
        collapsedColumns={collapsedColumns}
        onToggleColumn={handleToggleColumn}
        viewMode={viewMode}
      />

      <TaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTask={editingTask}
        onSubmit={handleSubmitTask}
        loading={submitting}
      />
    </section>
  );
}
