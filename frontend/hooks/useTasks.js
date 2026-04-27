'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createTask as createTaskRequest,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask as updateTaskRequest
} from '../lib/api/tasks';

const EMPTY_FILTERS = Object.freeze({});

export function useTasks(initialFilters = EMPTY_FILTERS) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async (filters = initialFilters) => {
    try {
      setLoading(true);
      setError('');
      const response = await getTasks(filters);
      setTasks(response.tasks || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      fetchTasks();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fetchTasks]);

  async function createTaskItem(payload) {
    setSubmitting(true);
    try {
      const response = await createTaskRequest(payload);
      setTasks((prev) => [response.task, ...prev]);
      return response.task;
    } finally {
      setSubmitting(false);
    }
  }

  async function updateTaskItem(id, payload) {
    setSubmitting(true);
    try {
      const response = await updateTaskRequest(id, payload);
      setTasks((prev) => prev.map((task) => (task._id === id ? response.task : task)));
      return response.task;
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteTaskItem(id) {
    setSubmitting(true);
    try {
      await deleteTaskRequest(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } finally {
      setSubmitting(false);
    }
  }

  return {
    tasks,
    setTasks,
    loading,
    submitting,
    error,
    setError,
    fetchTasks,
    createTaskItem,
    updateTaskItem,
    deleteTaskItem
  };
}
