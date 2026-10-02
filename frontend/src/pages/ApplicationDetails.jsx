import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import ApplicationForm from '../components/applications/ApplicationForm';
import ErrorState from '../components/common/ErrorState';
import InterviewsSection from '../components/interviews/InterviewsSection';
import NotesSection from '../components/notes/NotesSection';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Select } from '../components/ui/Field';
import Modal from '../components/ui/Modal';
import Skeleton from '../components/ui/Skeleton';
import StatusBadge from '../components/ui/StatusBadge';
import { useAsync } from '../hooks/useAsync';
import { useToast } from '../hooks/useToast';
import { applicationService } from '../services/applicationService';
import { companyService } from '../services/companyService';
import { interviewService } from '../services/interviewService';
import { noteService } from '../services/noteService';
import { APPLICATION_STATUSES } from '../utils/constants';
import { getErrorMessage } from '../utils/errors';
import { displayUrl, formatDate, formatSalary, toSafeUrl } from '../utils/format';

function Detail({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{children}</dd>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div role="status" aria-label="Loading application" className="space-y-6">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-40 rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  );
}

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);

  const { data, error, reload, setData } = useAsync(async () => {
    const application = await applicationService.get(id);
    const [companies, interviews, notes] = await Promise.all([
      companyService.listAll(),
      interviewService.listForApplication(id),
      noteService.listForApplication(id),
    ]);
    return { application, companies, interviews, notes };
  }, [id]);

  // Ignore stale data left over from a previously viewed application.
  const current = data && String(data.application.id) === id ? data : null;

  if (error && !current) {
    return (
      <Card>
        <ErrorState
          error={error}
          title="Could not load this application"
          onRetry={reload}
          action={<Link to="/applications"><Button variant="secondary">Back to applications</Button></Link>}
        />
      </Card>
    );
  }
  if (!current) return <DetailsSkeleton />;

  const { application, companies, interviews, notes } = current;
  const company = companies.find((item) => item.id === application.company_id);
  const websiteHref = toSafeUrl(company?.website);

  async function handleSave(payload) {
    const updated = await applicationService.update(application.id, payload);
    setData((prev) => ({ ...prev, application: updated }));
    toast.success('Application updated.');
    setEditing(false);
  }

  async function handleStatusChange(event) {
    setStatusSaving(true);
    try {
      const updated = await applicationService.update(application.id, { status: event.target.value });
      setData((prev) => ({ ...prev, application: updated }));
      toast.success('Status updated.');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleDelete() {
    await applicationService.remove(application.id);
    toast.success('Application deleted.');
    navigate('/applications', { replace: true });
  }

  const statusOptions = APPLICATION_STATUSES.some((item) => item.value === application.status)
    ? APPLICATION_STATUSES
    : [{ value: application.status, label: application.status }, ...APPLICATION_STATUSES];

  return (
    <>
      <Link to="/applications" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800">
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Applications
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="break-words text-2xl font-semibold tracking-tight text-slate-900">{application.job_title}</h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">{company?.name ?? `Company #${application.company_id}`} · {application.job_type}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Select aria-label="Update status" className="h-8 w-36 py-0" value={application.status} onChange={handleStatusChange} disabled={statusSaving}>
            {statusOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </Select>
          <Button variant="secondary" size="sm" icon={Pencil} onClick={() => setEditing(true)}>Edit</Button>
          <Button variant="danger-ghost" size="sm" icon={Trash2} onClick={() => setDeleting(true)}>Delete</Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader title="Overview" />
          <dl className="grid gap-x-6 gap-y-5 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <Detail label="Company">{company?.name ?? `Company #${application.company_id}`}</Detail>
            <Detail label="Job type">{application.job_type}</Detail>
            <Detail label="Applied on">{formatDate(application.applied_date)}</Detail>
            <Detail label="Salary">{formatSalary(application.salary)}</Detail>
            {company?.location && <Detail label="Location">{company.location}</Detail>}
            {company?.industry && <Detail label="Industry">{company.industry}</Detail>}
            {company?.website && (
              <Detail label="Website">
                {websiteHref ? (
                  <a href={websiteHref} target="_blank" rel="noopener noreferrer" className="break-all text-brand-600 hover:underline">{displayUrl(company.website)}</a>
                ) : company.website}
              </Detail>
            )}
          </dl>
          <div className="border-t border-slate-100 p-5">
            <h3 className="text-xs font-medium uppercase tracking-wide text-slate-500">Description</h3>
            {application.description ? (
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">{application.description}</p>
            ) : (
              <p className="mt-2 text-sm text-slate-400">No description added.</p>
            )}
          </div>
        </Card>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <InterviewsSection applicationId={application.id} interviews={interviews} onChanged={reload} />
          <NotesSection applicationId={application.id} notes={notes} onChanged={reload} />
        </div>
      </div>

      <Modal open={editing} onClose={() => setEditing(false)} title="Edit application" size="lg">
        {editing && <ApplicationForm initial={application} companies={companies} onSubmit={handleSave} onCancel={() => setEditing(false)} />}
      </Modal>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        title="Delete application"
        message={`Delete "${application.job_title}"? Its interviews and notes will be deleted too. This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
