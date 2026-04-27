'use client';

import Modal from '../ui/Modal';
import LeadForm from './LeadForm';

export default function LeadModal({ open, onClose, initialLead, onSubmit, loading }) {
  return (
    <Modal open={open} onClose={onClose} title={initialLead ? 'Edit Lead' : 'Create Lead'}>
      <LeadForm key={initialLead?._id || 'create'} initialLead={initialLead} onSubmit={onSubmit} loading={loading} />
    </Modal>
  );
}
