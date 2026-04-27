import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';
import { TASK_STATUS_META } from '../../lib/constants/statuses';
import { GripVertical, CalendarDays } from 'lucide-react';

export default function TaskCard({ task, onEdit, onDelete, dragHandleProps }) {
  const statusMeta = TASK_STATUS_META[task.status] || TASK_STATUS_META.todo;

  return (
    <Card className="group space-y-3 border border-[color:var(--surface-border)] p-3 transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)]">
      <div className="flex items-start justify-between gap-2">
        <button
          className="flex flex-1 items-start gap-3 text-left"
          title="Drag task"
          {...(dragHandleProps || {})}
        >
          <span className="mt-0.5 text-[color:var(--muted)] transition group-hover:text-[color:var(--foreground)]">
            <GripVertical size={14} />
          </span>
          <span className="min-w-0">
            <h4 className="text-sm font-semibold text-[color:var(--foreground)]">{task.title}</h4>
            {task.description ? <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">{task.description}</p> : null}
          </span>
        </button>
        <Dropdown
          items={[
            { label: 'Edit', onClick: () => onEdit(task) },
            { label: 'Delete', onClick: () => onDelete(task._id) }
          ]}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
        {task.dueDate ? (
          <span className="inline-flex items-center gap-1 text-xs text-[color:var(--muted)]">
            <CalendarDays size={12} /> Due {new Date(task.dueDate).toLocaleDateString()}
          </span>
        ) : null}
      </div>
    </Card>
  );
}
