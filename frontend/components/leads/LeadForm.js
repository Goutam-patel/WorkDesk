'use client';

import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { LEAD_STATUS_OPTIONS } from '../../lib/constants/statuses';
import { PRIORITY_OPTIONS } from '../../lib/constants/priorities';

const initialValues = {
  title: '',
  company: '',
  contactName: '',
  email: '',
  phone: '',
  website: '',
  source: 'other',
  estimatedValue: 0,
  notes: '',
  status: 'new',
  priority: 'medium'
};

export default function LeadForm({ initialLead, onSubmit, loading }) {
  const [form, setForm] = useState(() =>
    initialLead
      ? {
          title: initialLead.title || '',
          company: initialLead.company || '',
          contactName: initialLead.contactName || '',
          email: initialLead.email || '',
          phone: initialLead.phone || '',
          website: initialLead.website || '',
          source: initialLead.source || 'other',
          estimatedValue: initialLead.estimatedValue || 0,
          notes: initialLead.notes || '',
          status: initialLead.status || 'new',
          priority: initialLead.priority || 'medium'
        }
      : initialValues
  );

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit(form);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        label="Lead title"
        value={form.title}
        onChange={(event) => updateField('title', event.target.value)}
        required
      />
      <Input
        label="Company"
        value={form.company}
        onChange={(event) => updateField('company', event.target.value)}
        required
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Contact person"
          value={form.contactName}
          onChange={(event) => updateField('contactName', event.target.value)}
        />
        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Phone"
          value={form.phone}
          onChange={(event) => updateField('phone', event.target.value)}
        />
        <Input
          label="Website"
          value={form.website}
          onChange={(event) => updateField('website', event.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium">Source</span>
          <select
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
            value={form.source}
            onChange={(event) => updateField('source', event.target.value)}
          >
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="linkedin">LinkedIn</option>
            <option value="email">Email</option>
            <option value="event">Event</option>
            <option value="ads">Ads</option>
            <option value="other">Other</option>
          </select>
        </label>
        <Input
          label="Estimated value"
          type="number"
          min={0}
          step="0.01"
          value={form.estimatedValue}
          onChange={(event) => updateField('estimatedValue', event.target.value === '' ? 0 : Number(event.target.value))}
        />
      </div>
      <label className="flex flex-col gap-2 text-sm text-slate-200">
        <span className="font-medium">Notes</span>
        <textarea
          className="min-h-24 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none focus-ring"
          value={form.notes}
          onChange={(event) => updateField('notes', event.target.value)}
          maxLength={4000}
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
            {LEAD_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-200">
          <span className="font-medium">Priority</span>
          <select
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white"
            value={form.priority}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {initialLead ? 'Save Changes' : 'Create Lead'}
      </Button>
    </form>
  );
}
