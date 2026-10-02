import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Briefcase, FilterX, Plus } from 'lucide-react';
import ApplicationForm from '../components/applications/ApplicationForm';
import ApplicationList from '../components/applications/ApplicationList';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ListSkeleton from '../components/common/ListSkeleton';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { Select } from '../components/ui/Field';
import Modal from '../components/ui/Modal';
import { useAsync } from '../hooks/useAsync';
import { useToast } from '../hooks/useToast';
import { applicationService } from '../services/applicationService';
import { companyService } from '../services/companyService';
import { APPLICATION_STATUSES, PAGE_SIZE } from '../utils/constants';
import { sliceWithNext } from '../utils/pagination';

export default function Applications() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const status = searchParams.get('status') ?? '';
  const companyId = searchParams.get('company') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [formState, setFormState] = useState(null); // { application } | null
  const [toDelete, setToDelete] = useState(null);

  const companies = useAsync(companyService.listAll, []);
  const companyMap = useMemo(() => new Map((companies.data ?? []).map((company) => [company.id, company.name])), [companies.data]);
  const companyName = (id) => companyMap.get(id) ?? `Company #${id}`;

  const { data, loading, error, reload } = useAsync(
    async () =>
      sliceWithNext(
        await applicationService.list({ status, companyId, skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE + 1 }),
        PAGE_SIZE,
      ),
    [status, companyId, page],
  );

  // Dashboard quick action: /applications?new=1
  useEffect(() => {
    if (searchParams.get('new')) {
      setFormState({ application: null });
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.delete('new');
        return next;
      }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  function updateParams(changes) {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
      return next;
    });
  }

  const setPage = (value) => updateParams({ page: value > 1 ? String(value) : '' });
  const setFilter = (key) => (event) => updateParams({ [key]: event.target.value, page: '' });
  const clearFilters = () => updateParams({ status: '', company: '', page: '' });

  async function handleSave(payload) {
    const editing = formState.application;
    if (editing) await applicationService.update(editing.id, payload);
    else await applicationService.create(payload);
    toast.success(editing ? 'Application updated.' : 'Application added.');
    setFormState(null);
    if (!editing && page !== 1) setPage(1);
    else reload();
  }

  async function handleDelete() {
    await applicationService.remove(toDelete.id);
    toast.success('Application deleted.');
    if (data.items.length === 1 && page > 1) setPage(page - 1);
    else reload();
  }

  const filtered = Boolean(status || companyId);
  const isEmpty = data && data.items.length === 0 && page === 1;

  return (
    <>
      <PageHeader
        title="Applications"
        description="Every role you have applied for, in one place."
        actions={<Button icon={Plus} onClick={() => setFormState({ application: null })}>Add application</Button>}
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <div className="grid flex-1 gap-3 sm:max-w-lg sm:grid-cols-2">
            <Select aria-label="Filter by status" value={status} onChange={setFilter('status')} disabled={Boolean(companyId)}>
              <option value="">All statuses</option>
              {APPLICATION_STATUSES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </Select>
            <Select aria-label="Filter by company" value={status ? '' : companyId} onChange={setFilter('company')} disabled={Boolean(status)}>
              <option value="">All companies</option>
              {(companies.data ?? []).map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
            </Select>
          </div>
          {filtered && <Button variant="ghost" size="sm" icon={FilterX} onClick={clearFilters}>Clear filters</Button>}
          <p className="text-xs text-slate-400 sm:ml-auto">Status and company filters can&apos;t be combined.</p>
        </div>

        {error && !data ? (
          <ErrorState error={error} title="Could not load applications" onRetry={reload} />
        ) : loading && !data ? (
          <ListSkeleton />
        ) : isEmpty ? (
          filtered ? (
            <EmptyState
              icon={Briefcase}
              title="No matching applications"
              description="Nothing matches the current filter."
              action={<Button variant="secondary" icon={FilterX} onClick={clearFilters}>Clear filters</Button>}
            />
          ) : (
            <EmptyState
              icon={Briefcase}
              title="No applications yet"
              description="Track every role you apply for and watch your progress build."
              action={<Button icon={Plus} onClick={() => setFormState({ application: null })}>Add your first application</Button>}
            />
          )
        ) : (
          <>
            {error && <p role="alert" className="border-b border-red-100 bg-red-50 px-5 py-2 text-sm text-red-700">Could not refresh the list. Showing the last loaded results.</p>}
            <div className={loading ? 'opacity-60 transition-opacity' : ''}>
              <ApplicationList
                applications={data.items}
                companyName={companyName}
                onEdit={(application) => setFormState({ application })}
                onDelete={setToDelete}
              />
            </div>
            <Pagination page={page} hasNext={data.hasNext} loading={loading} onChange={setPage} />
          </>
        )}
      </Card>

      <Modal open={Boolean(formState)} onClose={() => setFormState(null)} title={formState?.application ? 'Edit application' : 'Add application'} size="lg">
        {formState && (
          <ApplicationForm
            initial={formState.application}
            companies={companies.data ?? []}
            onSubmit={handleSave}
            onCancel={() => setFormState(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete application"
        message={toDelete && `Delete "${toDelete.job_title}"? Its interviews and notes will be deleted too. This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
