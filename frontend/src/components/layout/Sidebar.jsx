import { NavLink } from 'react-router-dom';
import { Briefcase, Building2, CalendarClock, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { initials } from '../../utils/format';
import Logo from './Logo';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/applications', label: 'Applications', icon: Briefcase },
  { to: '/companies', label: 'Companies', icon: Building2 },
  { to: '/interviews', label: 'Interviews', icon: CalendarClock },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

function navClass({ isActive }) {
  return `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;
}

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="px-5 py-5"><Logo /></div>

      <nav aria-label="Main" className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navClass} onClick={onNavigate}>
            <Icon aria-hidden="true" className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="mb-2 flex items-center gap-3 px-2 py-1.5">
          <div aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
            {initials(user?.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <LogOut aria-hidden="true" className="h-5 w-5" />
          Log out
        </button>
      </div>
    </div>
  );
}
