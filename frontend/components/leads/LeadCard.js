import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Dropdown from '../ui/Dropdown';
import { LEAD_STATUS_META } from '../../lib/constants/statuses';
import { PRIORITY_META } from '../../lib/constants/priorities';
import { Mail, Phone, Building2 } from 'lucide-react';

export default function LeadCard({ lead, onEdit, onDelete, onQuickUpdate, selected, onToggleSelect }) {
  const statusMeta = LEAD_STATUS_META[lead.status] || LEAD_STATUS_META.new;
  const priorityMeta = PRIORITY_META[lead.priority] || PRIORITY_META.medium;

  const quickItems = [
    { label: 'Edit', onClick: () => onEdit(lead) },
    { label: 'Status: Contacted', onClick: () => onQuickUpdate(lead._id, { status: 'contacted' }) },
    { label: 'Status: Qualified', onClick: () => onQuickUpdate(lead._id, { status: 'qualified' }) },
    { label: 'Status: Won', onClick: () => onQuickUpdate(lead._id, { status: 'won' }) },
    { kind: 'divider' },
    { label: 'Priority: High', onClick: () => onQuickUpdate(lead._id, { priority: 'high' }) },
    { label: 'Priority: Medium', onClick: () => onQuickUpdate(lead._id, { priority: 'medium' }) },
    { label: 'Priority: Low', onClick: () => onQuickUpdate(lead._id, { priority: 'low' }) },
    { kind: 'divider' },
    { label: 'Delete', onClick: () => onDelete(lead._id), tone: 'danger' }
  ];

  return (
    <Card className="space-y-3 border border-[color:var(--surface-border)]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(event) => onToggleSelect(lead._id, event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[color:var(--surface-border)] bg-[color:var(--surface)]"
            aria-label={`Select ${lead.title}`}
          />
          <div>
            <h3 className="text-base font-semibold text-[color:var(--foreground)]">{lead.title}</h3>
            <p className="inline-flex items-center gap-1 text-sm text-[color:var(--foreground)]"><Building2 size={14} /> {lead.company}</p>
            {lead.contactName ? <p className="mt-1 text-xs text-[color:var(--muted)]">Contact: {lead.contactName}</p> : null}
            {lead.email ? <p className="inline-flex items-center gap-1 text-xs text-[color:var(--muted)]"><Mail size={12} /> {lead.email}</p> : null}
            {lead.phone ? <p className="inline-flex items-center gap-1 text-xs text-[color:var(--muted)]"><Phone size={12} /> {lead.phone}</p> : null}
          </div>
        </div>
        <Dropdown items={quickItems} />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
        <Badge tone={priorityMeta.tone}>{priorityMeta.label} Priority</Badge>
        {lead.source ? <Badge tone="neutral">Source: {lead.source}</Badge> : null}
        {lead.estimatedValue ? <Badge tone="info">${Number(lead.estimatedValue).toLocaleString()}</Badge> : null}
      </div>
      {lead.notes ? <p className="text-xs text-[color:var(--muted)]">{lead.notes}</p> : null}
    </Card>
  );
}
