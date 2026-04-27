'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  createLead as createLeadRequest,
  deleteLead as deleteLeadRequest,
  getLeads,
  updateLead as updateLeadRequest
} from '../lib/api/leads';

const EMPTY_FILTERS = Object.freeze({});

export function useLeads(initialFilters = EMPTY_FILTERS) {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchLeads = useCallback(async (filters = initialFilters) => {
    try {
      setLoading(true);
      setError('');
      const response = await getLeads(filters);
      setLeads(response.leads || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      fetchLeads();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fetchLeads]);

  async function createLeadItem(payload) {
    setSubmitting(true);
    try {
      await createLeadRequest(payload);
      await fetchLeads();
    } finally {
      setSubmitting(false);
    }
  }

  async function updateLeadItem(id, payload) {
    setSubmitting(true);
    try {
      await updateLeadRequest(id, payload);
      await fetchLeads();
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteLeadItem(id) {
    setSubmitting(true);
    try {
      await deleteLeadRequest(id);
      await fetchLeads();
    } finally {
      setSubmitting(false);
    }
  }

  async function bulkUpdateLeads(ids, payload) {
    if (!Array.isArray(ids) || ids.length === 0) {
      return;
    }

    setSubmitting(true);
    try {
      await Promise.all(ids.map((id) => updateLeadRequest(id, payload)));
      await fetchLeads();
    } finally {
      setSubmitting(false);
    }
  }

  return {
    leads,
    loading,
    submitting,
    error,
    setError,
    fetchLeads,
    createLeadItem,
    updateLeadItem,
    deleteLeadItem,
    bulkUpdateLeads
  };
}
