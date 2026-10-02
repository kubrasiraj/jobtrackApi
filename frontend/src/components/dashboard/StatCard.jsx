import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Card from '../ui/Card';

export default function StatCard({ label, value, icon: Icon, accent, to }) {
  return (
    <Link to={to} className="group block rounded-xl focus-visible:outline-offset-4">
      <Card className="p-5 transition-shadow group-hover:shadow-md">
        <div className="flex items-start justify-between">
          <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
            <Icon aria-hidden="true" className="h-5 w-5" />
          </span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
        </div>
        <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        <p className="mt-0.5 text-sm text-slate-500">{label}</p>
      </Card>
    </Link>
  );
}
