import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';

// The API does not report totals, so we only know whether a next page exists.
export default function Pagination({ page, hasNext, loading, onChange }) {
  if (page === 1 && !hasNext) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
      <p className="text-sm text-slate-500">Page {page}</p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={page === 1 || loading} onClick={() => onChange(page - 1)}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={!hasNext || loading} onClick={() => onChange(page + 1)}>
          Next
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
