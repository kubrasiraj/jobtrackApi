import { FALLBACK_STATUS_META, STATUS_META } from '../../utils/constants';
import { titleCase } from '../../utils/format';

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] ?? FALLBACK_STATUS_META;
  const label = STATUS_META[status]?.label ?? titleCase(status ?? 'Unknown');
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${meta.badge}`}>
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {label}
    </span>
  );
}
