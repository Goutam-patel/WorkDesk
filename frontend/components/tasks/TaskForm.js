'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { TASK_STATUS_OPTIONS } from '../../lib/constants/statuses';

const initialValues = {
  title: '',
  description: '',
  status: 'todo',
  dueDate: ''
};

function toDateInputValue(dateValue) {
  if (!dateValue) {
    return '';
  }

  return new Date(dateValue).toISOString().slice(0, 10);
}

export default function TaskForm({ initialTask, onSubmit, loading }) {
  const [form, setForm] = useState(() =>
    initialTask
      ? {
          title: initialTask.title || '',
          description: initialTask.description || '',
          status: initialTask.status || 'todo',
          dueDate: toDateInputValue(initialTask.dueDate)
        }
      : initialValues
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = {
      ...form,
      dueDate: form.dueDate || null
    };
    await onSubmit(payload);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Task title"
        value={form.title}
        onChange={(event) => updateField('title', event.target.value)}
        required
      />
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        <span className="font-medium">Description</span>
        <textarea
          className="min-h-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus-ring"
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          maxLength={2000}
        />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium">Status</span>
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
            value={form.status}
            onChange={(event) => updateField('status', event.target.value)}
          >
            {TASK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Due date"
          type="date"
          value={form.dueDate}
          onChange={(event) => updateField('dueDate', event.target.value)}
        />
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {initialTask ? 'Save Changes' : 'Create Task'}
      </Button>
    </form>
  );
}
