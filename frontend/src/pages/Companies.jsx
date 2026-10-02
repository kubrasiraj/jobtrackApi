import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Building2, Plus } from 'lucide-react';
import CompanyForm from '../components/companies/CompanyForm';
import CompanyList from '../components/companies/CompanyList';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ListSkeleton from '../components/common/ListSkeleton';
import PageHeader from '../components/common/PageHeader';
import Pagination from '../components/common/Pagination';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Modal from '../components/ui/Modal';
import { useAsync } from '../hooks/useAsync';
import { useToast } from '../hooks/useToast';
import { companyService } from '../services/companyService';
import { PAGE_SIZE } from '../utils/constants';
import { getStatus } from '../utils/errors';
import { sliceWithNext } from '../utils/pagination';

export default function Companies() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [formState, setFormState] = useState(null); // { company } | null
  const [toDelete, setToDelete] = useState(null);

  const { data, loading, error, reload } = useAsync(
    async () => sliceWithNext(await companyService.list({ skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE + 1 }), PAGE_SIZE),
    [page],
  );

  // Dashboard quick action: /companies?new=1
  useEffect(() => {
    if (searchParams.get('new')) {
      setFormState({ company: null });
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  async function handleSave(payload) {
    const editing = formState.company;
    if (editing) await companyService.update(editing.id, payload);
    else await companyService.create(payload);
    toast.success(editing ? 'Company updated.' : 'Company added.');
    setFormState(null);
    reload();
  }

  async function handleDelete() {
    try {
      await companyService.remove(toDelete.id);
    } catch (error) {
      // The API fails with an unhandled 500 (which browsers surface as a network
      // error with no status) when applications still reference the company.
      const status = getStatus(error);
      if (status === null || status >= 500) {
        error.friendlyMessage = 'This company could not be deleted. It may still be linked to applications, or the server may be unreachable.';
      }
      throw error;
    }
    toast.success('Company deleted.');
    if (data.items.length === 1 && page > 1) setPage(page - 1);
    else reload();
  }

  const isEmpty = data && data.items.length === 0 && page === 1;

  return (
    <>
      <PageHeader
        title="Companies"
        description="Organisations you are applying to. The company directory is shared across all JobTrack accounts."
        actions={<Button icon={Plus} onClick={() => setFormState({ company: null })}>Add company</Button>}
      />

      <Card>
        {error && !data ? (
          <ErrorState error={error} title="Could not load companies" onRetry={reload} />
        ) : loading && !data ? (
          <ListSkeleton />
        ) : isEmpty ? (
          <EmptyState
            icon={Building2}
            title="No companies yet"
            description="Add the companies you want to apply to, then link applications to them."
            action={<Button icon={Plus} onClick={() => setFormState({ company: null })}>Add your first company</Button>}
          />
        ) : (
          <>
            <CompanyList companies={data.items} onEdit={(company) => setFormState({ company })} onDelete={setToDelete} />
            <Pagination page={page} hasNext={data.hasNext} loading={loading} onChange={setPage} />
          </>
        )}
      </Card>

      <Modal open={Boolean(formState)} onClose={() => setFormState(null)} title={formState?.company ? 'Edit company' : 'Add company'}>
        {formState && <CompanyForm initial={formState.company} onSubmit={handleSave} onCancel={() => setFormState(null)} />}
      </Modal>

      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete company"
        message={toDelete && `Delete ${toDelete.name}? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </>
  );
}
