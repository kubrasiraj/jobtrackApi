export const PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
// Integer columns are 32-bit; larger values make the API fail with a 500.
export const MAX_INT = 2147483647;

// Application statuses are exact, upper-case strings: the backend filters
// and the dashboard counts rely on these exact values.
export const APPLICATION_STATUSES = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer' },
  { value: 'REJECTED', label: 'Rejected' },
];

export const INTERVIEW_STATUSES = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const JOB_TYPES = ['Internship', 'Full-time', 'Part-time', 'Contract'];
export const INTERVIEW_TYPES = ['Online', 'Phone', 'On-site'];

// Visual treatment per status value (badge classes, dot and chart colours).
export const STATUS_META = {
  APPLIED: { label: 'Applied', badge: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500', color: '#3b82f6' },
  INTERVIEW: { label: 'Interview', badge: 'bg-violet-50 text-violet-700 ring-violet-600/20', dot: 'bg-violet-500', color: '#8b5cf6' },
  OFFER: { label: 'Offer', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500', color: '#10b981' },
  REJECTED: { label: 'Rejected', badge: 'bg-rose-50 text-rose-700 ring-rose-600/20', dot: 'bg-rose-500', color: '#f43f5e' },
  SCHEDULED: { label: 'Scheduled', badge: 'bg-blue-50 text-blue-700 ring-blue-600/20', dot: 'bg-blue-500', color: '#3b82f6' },
  COMPLETED: { label: 'Completed', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20', dot: 'bg-emerald-500', color: '#10b981' },
  CANCELLED: { label: 'Cancelled', badge: 'bg-slate-100 text-slate-600 ring-slate-500/20', dot: 'bg-slate-400', color: '#94a3b8' },
};

export const FALLBACK_STATUS_META = {
  badge: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  dot: 'bg-slate-400',
  color: '#94a3b8',
};
