const HAS_TIMEZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

// Timestamps such as created_at are stored in UTC but may arrive without a
// timezone suffix, so treat them as UTC explicitly.
function parseUtc(value) {
  if (!value) return null;
  const text = String(value);
  const date = new Date(HAS_TIMEZONE.test(text) ? text : `${text}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Interview times are naive "wall clock" values: show them exactly as entered.
export function parseLocal(value) {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date;
}

// Date-only values (YYYY-MM-DD) must not be shifted by the timezone.
function parseDateOnly(value) {
  if (!value) return null;
  const [year, month, day] = String(value).split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const longDateFormat = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
const timeFormat = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
const numberFormat = new Intl.NumberFormat('en-US');

export function formatDate(value) {
  const date = parseDateOnly(value);
  return date ? dateFormat.format(date) : '—';
}

export function formatInterviewDate(value) {
  const date = parseLocal(value);
  return date ? longDateFormat.format(date) : '—';
}

export function formatInterviewTime(value) {
  const date = parseLocal(value);
  return date ? timeFormat.format(date) : '';
}

export function formatTimestamp(value) {
  const date = parseUtc(value);
  return date ? `${dateFormat.format(date)}, ${timeFormat.format(date)}` : '—';
}

export function formatMemberSince(value) {
  const date = parseUtc(value);
  return date ? dateFormat.format(date) : '—';
}

export function formatSalary(value) {
  return value === null || value === undefined ? '—' : numberFormat.format(value);
}

export function todayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

// "2026-05-01T10:30:00" -> "2026-05-01T10:30" for <input type="datetime-local">.
export function toDateTimeInput(value) {
  return value ? String(value).slice(0, 16) : '';
}

// "2026-05-01T10:30" -> "2026-05-01T10:30:00" for the API.
export function fromDateTimeInput(value) {
  return value.length === 16 ? `${value}:00` : value;
}

export function titleCase(value = '') {
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '?';
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

export function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Returns a safe absolute http(s) URL for display as a link, or null.
export function toSafeUrl(value) {
  const text = (value || '').trim();
  if (!text || /\s/.test(text)) return null;
  if (/^(javascript|data|vbscript|file):/i.test(text)) return null;
  if (/^https?:\/\//i.test(text)) return text;
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? null : `https://${text}`;
}

export function displayUrl(value) {
  return (value || '').trim().replace(/^https?:\/\//i, '').replace(/\/$/, '');
}

export function blankToNull(value) {
  const text = (value ?? '').trim();
  return text === '' ? null : text;
}
