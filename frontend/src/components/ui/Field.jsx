import { useId } from 'react';

const CONTROL =
  'block w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25 disabled:bg-slate-50 disabled:text-slate-500';

function controlClass(invalid, extra = '') {
  return `${CONTROL} ${invalid ? 'border-red-400' : 'border-slate-300'} ${extra}`;
}

export function Field({ label, error, hint, required, children }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span aria-hidden="true" className="ml-0.5 text-red-500">*</span>}
      </label>
      {children({ id, invalid: Boolean(error), 'aria-describedby': describedBy })}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ invalid, className = '', ...props }) {
  return <input aria-invalid={invalid || undefined} className={controlClass(invalid, `h-10 ${className}`)} {...props} />;
}

export function Select({ invalid, className = '', children, ...props }) {
  return (
    <select aria-invalid={invalid || undefined} className={controlClass(invalid, `h-10 pr-8 ${className}`)} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ invalid, className = '', rows = 4, ...props }) {
  return <textarea rows={rows} aria-invalid={invalid || undefined} className={controlClass(invalid, `py-2 ${className}`)} {...props} />;
}
