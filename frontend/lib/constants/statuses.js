export const LEAD_STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'proposal', label: 'Proposal' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' }
];

export const TASK_STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'completed', label: 'Completed' }
];

export const TASK_WIP_LIMITS = {
  todo: 10,
  in_progress: 5,
  blocked: 4,
  completed: 999
};

export const TASK_STATUS_META = {
  todo: { label: 'To Do', tone: 'neutral' },
  in_progress: { label: 'In Progress', tone: 'info' },
  blocked: { label: 'Blocked', tone: 'danger' },
  completed: { label: 'Completed', tone: 'success' }
};

export const LEAD_STATUS_META = {
  new: { label: 'New', tone: 'info' },
  contacted: { label: 'Contacted', tone: 'neutral' },
  qualified: { label: 'Qualified', tone: 'success' },
  proposal: { label: 'Proposal', tone: 'warning' },
  won: { label: 'Won', tone: 'success' },
  lost: { label: 'Lost', tone: 'danger' }
};
