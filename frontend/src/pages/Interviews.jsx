import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, Plus } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ListSkeleton from '../components/common/ListSkeleton';
import PageHeader from '../components/common/PageHeader';
import InterviewCard from '../components/interviews/InterviewCard';
import InterviewFormModal from '../components/interviews/InterviewFormModal';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useAsync } from '../hooks/useAsync';
import { useToast } from '../hooks/useToast';
import { applicationService } from '../services/applicationService';
import { companyService } from '../services/companyService';
import { interviewService } from '../services/interviewService';
import { INTERVIEW_STATUSES } from '../utils/constants';
import { parseLocal } from '../utils/format';

// The API exposes interviews per application only, so this page gathers them
// from every application the user owns.
async function loadAllInterviews() {
  const [applications, companies] = await Promise.all([applicationService.listAll(), companyService.listAll()]);
  const companyNames = new Map(companies.map((company) => [company.id, company.name]));
  const perApplication = await Promise.all(applications.map((application) => interviewService.listForApplication(application.id)));

  const interviews = perApplication.flatMap((rows, index) => {
    const application = applications[index];
    const context = {
      applicationId: application.id,
      title: application.job_title,
      company: companyNames.get(application.company_id) ?? `Company #${application.company_id}`,
    };
    return rows.map((interview) => ({ interview, context }));
  });

  const options = applications.map((application) => ({
    id: application.id,
    label: `${application.job_title} · ${companyNames.get(application.company_id) ?? `Company #${application.company_id}`}`,
  }));

  return { interviews, options };
}

export default function Interviews() {
  const toast = useToast();
  const { data, loading, error, reload } = useAsync(loadAllInterviews, []);
  const [statusFilter, setStatusFilter] = useState('');
  const [formState, setFormState] = useState(null); // { interview } | null
  const [toDelete, setToDelete] = useState(null);

  const { upcoming, earlier } = useMemo(() => {
    const items = (data?.interviews ?? []).filter((item) => !statusFilter || item.interview.status === statusFilter);
    const time = (item) => parseLocal(item.interview.scheduled_at)?.getTime() ?? 0;
    const now = Date.now();
    const isUpcoming = (item) => item.interview.status === 'SCHEDULED' && time(item) >= now;
    return {
      upcoming: items.filter(isUpcoming).sort((a, b) => time(a) - time(b)),
      earlier: items.filter((item) => !isUpcoming(item)).sort((a, b) => time(b) - time(a)),
    };
  }, [data, statusFilter]);

  async function handleDelete() {
    await interviewService.remove(toDelete.interview.id);
    toast.success('Interview deleted.');
    reload();
  }

  const hasApplications = (data?.options.length ?? 0) > 0;
  const hasInterviews = (data?.interviews.length ?? 0) > 0;

  const renderGroup = (title, items) =>
    items.length > 0 && (
      <section key={title}>
        <h2 className="border-b border-slate-100 bg-slate-50/60 px-5 py-2.5 text-xs font-medium uppercase tracking-wide text-slate-500">
          {title} · {items.length}
        </h2>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <InterviewCard
              key={item.interview.id}
              interview={item.interview}
              context={item.context}
              onEdit={(interview) => setFormState({ interview })}
              onDelete={() => setToDelete(item)}
            />
          ))}
        </div>
      </section>
    );

  return (
    <>
      <PageHeader
        title="Interviews"
        description="Every interview round across your applications."
        actions={<Button icon={Plus} onClick={() => setFormState({ interview: null })} disabled={!hasApplications}>Schedule interview</Button>}
      />

      <Card>
        {error && !data ? (
          <ErrorState error={error} title="Could not load interviews" onRetry={reload} />
        ) : loading && !data ? (
          <ListSkeleton />
        ) : !hasApplications ? (
          <EmptyState
            icon={CalendarClock}
            title="No interviews scheduled"
            description="Interviews belong to applications. Add an application first, then schedule your rounds."
            action={<Link to="/applications?new=1"><Button icon={Plus}>Add an application</Button></Link>}
          />
        ) : !hasInterviews ? (
          <EmptyState
            icon={CalendarClock}
            title="No interviews scheduled"
            description="When a company invites you to interview, schedule it here."
            action={<Button icon={Plus} onClick={() => setFormState({ interview: null })}>Schedule your first interview</Button>}
          />
        ) : (
          <>
            <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-2 border-b border-slate-100 p-4">
              {[{ value: '', label: 'All' }, ...INTERVIEW_STATUSES].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={statusFilter === option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    statusFilter === option.value ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {upcoming.length + earlier.length === 0 ? (
              <EmptyState icon={CalendarClock} title="No matching interviews" description="No interviews have this status." />
            ) : (
              <div className={loading ? 'opacity-60 transition-opacity' : ''}>
                {renderGroup('Upcoming', upcoming)}
                {renderGroup('Earlier and other', earlier)}
              </div>
            )}
          </>
        )}
      </Card>

      <InterviewFormModal
        open={Boolean(formState)}
        interview={formState?.interview ?? null}
        applicationId={formState?.interview?.application_id}
        applications={data?.options ?? []}
        suggestedRound={1}
        onClose={() => setFormState(null)}
        onSaved={() => {
          setFormState(null);
          reload();
        }}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete interview"
        message={toDelete && `Delete the round ${toDelete.interview.round} interview for "${toDelete.context.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
