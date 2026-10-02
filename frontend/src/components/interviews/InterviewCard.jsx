import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';
import { formatInterviewDate, formatInterviewTime, parseLocal } from '../../utils/format';

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short' });

// `context` ({ applicationId, title, company }) is shown on the global list.
export default function InterviewCard({ interview, context, onEdit, onDelete }) {
  const date = parseLocal(interview.scheduled_at);

  return (
    <div className="flex gap-4 px-4 py-4 sm:px-5">
      <div aria-hidden="true" className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-100 text-slate-700">
        <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{date ? monthFormat.format(date) : '—'}</span>
        <span className="text-xl font-semibold leading-none">{date ? date.getDate() : ''}</span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <p className="font-medium text-slate-900">Round {interview.round} · {interview.interview_type}</p>
          <StatusBadge status={interview.status} />
        </div>
        <p className="mt-0.5 text-sm text-slate-500">
          {formatInterviewDate(interview.scheduled_at)} · {formatInterviewTime(interview.scheduled_at)}
        </p>
        {context && (
          <p className="mt-1 text-sm text-slate-600">
            <Link to={`/applications/${context.applicationId}`} className="font-medium text-brand-600 hover:text-brand-700 hover:underline">{context.title}</Link>
            <span className="text-slate-500"> · {context.company}</span>
          </p>
        )}
        {interview.feedback && (
          <p className="mt-2 whitespace-pre-wrap break-words rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">{interview.feedback}</p>
        )}
      </div>

      <div className="flex shrink-0 items-start gap-1">
        <Button variant="ghost" size="icon" aria-label={`Edit round ${interview.round} interview`} onClick={() => onEdit(interview)}><Pencil className="h-4 w-4" /></Button>
        <Button variant="danger-ghost" size="icon" aria-label={`Delete round ${interview.round} interview`} onClick={() => onDelete(interview)}><Trash2 className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
