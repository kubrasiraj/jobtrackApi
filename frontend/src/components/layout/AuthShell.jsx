import { Briefcase, CalendarClock, ChartPie } from 'lucide-react';
import Logo from './Logo';

const HIGHLIGHTS = [
  { icon: Briefcase, text: 'Keep every application, company and status in one place.' },
  { icon: CalendarClock, text: 'Track interview rounds, schedules and feedback.' },
  { icon: ChartPie, text: 'See where your search stands at a glance.' },
];

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-slate-900 p-12 lg:flex">
        <div aria-hidden="true" className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/30 blur-3xl" />
        <Logo tone="light" />
        <div className="relative">
          <h2 className="max-w-md text-3xl font-semibold leading-tight tracking-tight text-white">
            Run your job search like a well-organised project.
          </h2>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3 text-slate-300">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-brand-200">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="pt-1 text-sm">{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-slate-500">JobTrack</p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </div>
    </div>
  );
}
