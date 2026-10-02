import { AlertCircle, CheckCircle2 } from 'lucide-react';

const TONES = {
  error: { box: 'border-red-200 bg-red-50 text-red-800', icon: AlertCircle },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-800', icon: CheckCircle2 },
};

export default function Alert({ tone = 'error', children }) {
  const { box, icon: Icon } = TONES[tone];
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${box}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
