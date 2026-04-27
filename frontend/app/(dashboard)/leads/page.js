'use client';

import { useMemo, useState } from 'react';
import Button from '../../../components/ui/Button';
import LeadCard from '../../../components/leads/LeadCard';
import LeadModal from '../../../components/leads/LeadModal';
import { useLeads } from '../../../hooks/useLeads';
import { Plus } from 'lucide-react';

const priorityRank = { high: 3, medium: 2, low: 1 };
const statusRank = { won: 6, proposal: 5, qualified: 4, contacted: 3, new: 2, lost: 1 };

export default function LeadsPage() {
  const {
    leads,
    loading,
    submitting,
    error,
    setError,
    createLeadItem,
    updateLeadItem,
    deleteLeadItem,
    bulkUpdateLeads
  } = useLeads();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('contacted');
  const [bulkPriority, setBulkPriority] = useState('high');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      !search ||
      lead.title.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      (lead.contactName || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (lead.phone || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesPriority && matchesSource;
  });

  const sortedLeads = useMemo(() => {
    const items = [...filteredLeads];

    if (sortBy === 'priority') {
      return items.sort((a, b) => (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0));
    }

    if (sortBy === 'status') {
      return items.sort((a, b) => (statusRank[b.status] || 0) - (statusRank[a.status] || 0));
    }

    return items.sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [filteredLeads, sortBy]);

  function openCreateModal() {
    setEditingLead(null);
    setIsModalOpen(true);
  }

  function openEditModal(lead) {
    setEditingLead(lead);
    setIsModalOpen(true);
  }

  async function handleSubmitLead(payload) {
    setError('');
    try {
      if (editingLead) {
        await updateLeadItem(editingLead._id, payload);
      } else {
        await createLeadItem(payload);
      }
      setIsModalOpen(false);
      setEditingLead(null);
      setSelectedLeadIds([]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save lead');
    }
  }

  async function handleDeleteLead(id) {
    setError('');
    try {
      await deleteLeadItem(id);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete lead');
    }
  }

  async function handleQuickUpdateLead(id, payload) {
    setError('');
    try {
      await updateLeadItem(id, payload);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update lead');
    }
  }

  function handleToggleSelect(id, checked) {
    setSelectedLeadIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, id]));
      }
      return prev.filter((item) => item !== id);
    });
  }

  function handleToggleSelectAll(checked) {
    if (!checked) {
      setSelectedLeadIds([]);
      return;
    }

    setSelectedLeadIds(sortedLeads.map((lead) => lead._id));
  }

  async function handleBulkStatusUpdate() {
    if (selectedLeadIds.length === 0) {
      return;
    }

    setError('');
    try {
      await bulkUpdateLeads(selectedLeadIds, { status: bulkStatus });
      setSelectedLeadIds([]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update selected leads');
    }
  }

  async function handleBulkPriorityUpdate() {
    if (selectedLeadIds.length === 0) {
      return;
    }

    setError('');
    try {
      await bulkUpdateLeads(selectedLeadIds, { priority: bulkPriority });
      setSelectedLeadIds([]);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update selected leads');
    }
  }

  return (
    <section className="section-stagger space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">Leads</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">Track pipeline progress with filters, bulk actions, and quick edits.</p>
        </div>
        <Button onClick={openCreateModal}>
          <span className="inline-flex items-center gap-2"><Plus size={16} /> Create Lead</span>
        </Button>
      </div>

      <div className="glass grid gap-3 rounded-2xl p-4 md:grid-cols-5">
        <input
          className="w-full rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)] placeholder:text-[color:var(--muted)]"
          placeholder="Search by title or company"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          className="w-full rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="proposal">Proposal</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
        <select
          className="w-full rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]"
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          className="w-full rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]"
          value={sourceFilter}
          onChange={(event) => setSourceFilter(event.target.value)}
        >
          <option value="all">All Sources</option>
          <option value="website">Website</option>
          <option value="referral">Referral</option>
          <option value="linkedin">LinkedIn</option>
          <option value="email">Email</option>
          <option value="event">Event</option>
          <option value="ads">Ads</option>
          <option value="other">Other</option>
        </select>
        <select
          className="w-full rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]"
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="recent">Sort: Most Recent</option>
          <option value="priority">Sort: Priority</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
            <input
              type="checkbox"
              checked={sortedLeads.length > 0 && selectedLeadIds.length === sortedLeads.length}
              onChange={(event) => handleToggleSelectAll(event.target.checked)}
            />
            Select all ({selectedLeadIds.length})
          </label>
          <div className="flex items-center gap-2">
            <select
              className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]"
              value={bulkStatus}
              onChange={(event) => setBulkStatus(event.target.value)}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            <Button variant="secondary" onClick={handleBulkStatusUpdate} disabled={selectedLeadIds.length === 0 || submitting}>
              Bulk Status
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="rounded-xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-3 py-2 text-sm text-[color:var(--foreground)]"
              value={bulkPriority}
              onChange={(event) => setBulkPriority(event.target.value)}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <Button variant="secondary" onClick={handleBulkPriorityUpdate} disabled={selectedLeadIds.length === 0 || submitting}>
              Bulk Priority
            </Button>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}

      {loading ? (
        <p className="glass w-fit rounded-xl px-4 py-2 text-sm text-[color:var(--muted)]">Loading leads...</p>
      ) : sortedLeads.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-sm text-[color:var(--muted)]">
          No leads match your filters.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedLeads.map((lead) => (
            <LeadCard
              key={lead._id}
              lead={lead}
              onEdit={openEditModal}
              onDelete={handleDeleteLead}
              onQuickUpdate={handleQuickUpdateLead}
              selected={selectedLeadIds.includes(lead._id)}
              onToggleSelect={handleToggleSelect}
            />
          ))}
        </div>
      )}

      <LeadModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialLead={editingLead}
        onSubmit={handleSubmitLead}
        loading={submitting}
      />
    </section>
  );
}
