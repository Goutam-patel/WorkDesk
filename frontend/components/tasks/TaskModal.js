'use client';

import Modal from '../ui/Modal';
import TaskForm from './TaskForm';

export default function TaskModal({ open, onClose, initialTask, onSubmit, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={initialTask ? 'Edit Task' : 'Create Task'}>
      <TaskForm key={initialTask?._id || 'create'} initialTask={initialTask} onSubmit={onSubmit} loading={loading} />
    </Modal>
  );
}
