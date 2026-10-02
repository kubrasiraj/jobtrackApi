import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, Briefcase, Building2, CalendarClock, ChartPie, Plus, Send, XCircle } from 'lucide-react';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import PageHeader from '../components/common/PageHeader';
import StatCard from '../components/dashboard/StatCard';
import StatusDonut from '../components/dashboard/StatusDonut';
import Button from '../components/ui/Button';
import Card, { CardHeader } from '../components/ui/Card';
import Skeleton from '../components/ui/Skeleton';
import { useAsync } from '../hooks/useAsync';
import { useAuth } from '../hooks/useAuth';
import { dashboardService } from '../services/dashboardService';
import { FALLBACK_STATUS_META, STATUS_META } from '../utils/constants';
import { greeting } from '../utils/format';

const QUICK_ACTIONS = [
  { to: '/applications?new=1', label: 'Add an application', icon: Plus },
  { to: '/companies?new=1', label: 'Add a company', icon: Building2 },
  { to: '/interviews', label: 'View interviews', icon: CalendarClock },
  { to: '/applications', label: 'Review all applications', icon: Briefcase },
];

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-32 rounded-xl" />)}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-xl lg:col-span-2" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, loading, error, reload } = useAsync(dashboardService.getStats, []);

  const segments = useMemo(() => {
    if (!stats) return [];
    const known = [
      { key: 'APPLIED', value: stats.applied },
      { key: 'INTERVIEW', value: stats.interview },
      { key: 'OFFER', value: stats.offer },
      { key: 'REJECTED', value: stats.rejected },
    ].map((item) => ({ ...item, label: STATUS_META[item.key].label, color: STATUS_META[item.key].color, dot: STATUS_META[item.key].dot }));

    // The API only counts four statuses; anything else still belongs in the total.
    const other = stats.total_applications - known.reduce((sum, item) => sum + item.value, 0);
    if (other > 0) known.push({ key: 'OTHER', label: 'Other', value: other, color: FALLBACK_STATUS_META.color, dot: FALLBACK_STATUS_META.dot });
    return known;
  }, [stats]);

  const firstName = user.name.trim().split(/\s+/)[0];

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        description="Here is where your job search stands today."
        actions={<Link to="/applications?new=1"><Button icon={Plus}>Add application</Button></Link>}
      />

      {error && !stats ? (
        <Card><ErrorState error={error} title="Could not load your dashboard" onRetry={reload} /></Card>
      ) : loading && !stats ? (
        <DashboardSkeleton />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
            <StatCard label="Total applications" value={stats.total_applications} icon={Briefcase} accent="bg-brand-50 text-brand-600" to="/applications" />
            <StatCard label="Applied" value={stats.applied} icon={Send} accent="bg-blue-50 text-blue-600" to="/applications?status=APPLIED" />
            <StatCard label="Interviews" value={stats.interview} icon={CalendarClock} accent="bg-violet-50 text-violet-600" to="/applications?status=INTERVIEW" />
            <StatCard label="Offers" value={stats.offer} icon={Award} accent="bg-emerald-50 text-emerald-600" to="/applications?status=OFFER" />
            <StatCard label="Rejected" value={stats.rejected} icon={XCircle} accent="bg-rose-50 text-rose-600" to="/applications?status=REJECTED" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader title="Application status overview" description="How your applications are distributed." />
              {stats.total_applications === 0 ? (
                <EmptyState
                  icon={ChartPie}
                  title="No applications yet"
                  description="Add your first application and your progress will show up here."
                  action={<Link to="/applications?new=1"><Button icon={Plus}>Add your first application</Button></Link>}
                />
              ) : (
                <div className="flex flex-col items-center gap-8 p-6 sm:flex-row">
                  <StatusDonut segments={segments} total={stats.total_applications} />
                  <ul className="w-full flex-1 space-y-3">
                    {segments.map((segment) => {
                      const percent = Math.round((segment.value / stats.total_applications) * 100);
                      return (
                        <li key={segment.key}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-700">
                              <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${segment.dot}`} />
                              {segment.label}
                            </span>
                            <span className="text-slate-500"><span className="font-medium text-slate-900">{segment.value}</span> · {percent}%</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: segment.color }} />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </Card>

            <Card>
              <CardHeader title="Quick actions" />
              <ul className="p-2">
                {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
                  <li key={label}>
                    <Link to={to} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon aria-hidden="true" className="h-4 w-4" /></span>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
