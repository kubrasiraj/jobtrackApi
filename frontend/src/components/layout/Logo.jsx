import { Check } from 'lucide-react';

export default function Logo({ tone = 'dark' }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <Check className="h-5 w-5" strokeWidth={3} />
      </div>
      <span className={`text-lg font-semibold tracking-tight ${tone === 'light' ? 'text-white' : 'text-slate-900'}`}>JobTrack</span>
    </div>
  );
}
