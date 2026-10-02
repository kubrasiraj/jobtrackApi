import { LogOut } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { formatMemberSince, initials, titleCase } from '../utils/format';

function Detail({ label, children }) {
  return (
    <div className="px-5 py-4 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-slate-900 sm:col-span-2 sm:mt-0">{children}</dd>
    </div>
  );
}

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <>
      <PageHeader title="Profile" description="Your account information." />
      <Card className="max-w-2xl">
        <div className="flex items-center gap-4 border-b border-slate-100 px-5 py-5">
          <div aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-100 text-lg font-semibold text-brand-700">
            {initials(user.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-slate-900">{user.name}</p>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
          </div>
        </div>
        <dl className="divide-y divide-slate-100">
          <Detail label="Full name">{user.name}</Detail>
          <Detail label="Email">{user.email}</Detail>
          <Detail label="Role">{titleCase(user.role)}</Detail>
          <Detail label="Member since">{formatMemberSince(user.created_at)}</Detail>
        </dl>
        <div className="border-t border-slate-100 px-5 py-4">
          <Button variant="secondary" icon={LogOut} onClick={logout}>Log out</Button>
        </div>
      </Card>
    </>
  );
}
