import { RefreshCw, TriangleAlert } from 'lucide-react';
import { getErrorMessage } from '../../utils/errors';
import Button from '../ui/Button';

export default function ErrorState({ error, title = 'Something went wrong', onRetry, action }) {
  return (
    <div role="alert" className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <TriangleAlert className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{getErrorMessage(error)}</p>
      <div className="mt-5 flex gap-3">
        {onRetry && <Button variant="secondary" icon={RefreshCw} onClick={onRetry}>Try again</Button>}
        {action}
      </div>
    </div>
  );
}
