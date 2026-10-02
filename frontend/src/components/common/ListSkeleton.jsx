import Skeleton from '../ui/Skeleton';

export default function ListSkeleton({ rows = 5 }) {
  return (
    <div role="status" aria-label="Loading" className="divide-y divide-slate-100">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 py-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/5" />
          <Skeleton className="hidden h-4 w-1/6 sm:block" />
          <Skeleton className="ml-auto h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}
