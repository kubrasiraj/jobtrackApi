const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatusDonut({ segments, total }) {
  let offset = 0;
  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" role="img" aria-label={`Application status breakdown, ${total} total`}>
        <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        {segments.filter((segment) => segment.value > 0).map((segment) => {
          const length = (segment.value / total) * CIRCUMFERENCE;
          const circle = (
            <circle
              key={segment.key}
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke={segment.color}
              strokeWidth="12"
              strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
              strokeDashoffset={-offset}
            />
          );
          offset += length;
          return circle;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tracking-tight text-slate-900">{total}</span>
        <span className="text-xs text-slate-500">applications</span>
      </div>
    </div>
  );
}
