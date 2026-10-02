import { useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { Field, Input, Select, Textarea } from '../ui/Field';
import { APPLICATION_STATUSES, JOB_TYPES, MAX_INT } from '../../utils/constants';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { blankToNull, todayInputValue } from '../../utils/format';

export default function ApplicationForm({ initial, companies, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    job_title: initial?.job_title ?? '',
    company_id: initial ? String(initial.company_id) : '',
    job_type: initial?.job_type ?? JOB_TYPES[0],
    status: initial?.status ?? 'APPLIED',
    applied_date: initial?.applied_date ?? todayInputValue(),
    salary: initial?.salary ?? '',
    description: initial?.description ?? '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }));

  // Keep values the form does not know about (set elsewhere) selectable.
  const jobTypes = JOB_TYPES.includes(form.job_type) ? JOB_TYPES : [form.job_type, ...JOB_TYPES];
  const statuses = APPLICATION_STATUSES.some((s) => s.value === form.status)
    ? APPLICATION_STATUSES
    : [{ value: form.status, label: form.status }, ...APPLICATION_STATUSES];

  if (!companies.length) {
    return (
      <div className="space-y-5">
        <p className="text-sm text-slate-600">Every application belongs to a company. Add a company first, then come back to add your application.</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>Close</Button>
          <Link to="/companies?new=1"><Button>Add a company</Button></Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.job_title.trim()) nextErrors.job_title = 'Enter the job title.';
    if (!form.company_id) nextErrors.company_id = 'Select a company.';
    if (!form.applied_date) nextErrors.applied_date = 'Select the date you applied.';
    if (form.salary !== '' && (!Number.isInteger(Number(form.salary)) || Number(form.salary) < 0)) {
      nextErrors.salary = 'Enter a whole number, or leave blank.';
    } else if (Number(form.salary) > MAX_INT) {
      nextErrors.salary = 'That number is too large.';
    }
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await onSubmit({
        job_title: form.job_title.trim(),
        company_id: Number(form.company_id),
        job_type: form.job_type,
        status: form.status,
        applied_date: form.applied_date,
        salary: form.salary === '' ? null : Number(form.salary),
        description: blankToNull(form.description),
      });
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <Alert>{formError}</Alert>}
      <Field label="Job title" required error={errors.job_title}>
        {(props) => <Input {...props} maxLength={150} value={form.job_title} onChange={setField('job_title')} placeholder="Backend Engineering Intern" />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company" required error={errors.company_id}>
          {(props) => (
            <Select {...props} value={form.company_id} onChange={setField('company_id')}>
              <option value="">Select a company</option>
              {companies.map((company) => <option key={company.id} value={company.id}>{company.name}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Job type" required error={errors.job_type}>
          {(props) => (
            <Select {...props} value={form.job_type} onChange={setField('job_type')}>
              {jobTypes.map((type) => <option key={type} value={type}>{type}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Status" required error={errors.status}>
          {(props) => (
            <Select {...props} value={form.status} onChange={setField('status')}>
              {statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}
            </Select>
          )}
        </Field>
        <Field label="Applied date" required error={errors.applied_date}>
          {(props) => <Input {...props} type="date" value={form.applied_date} onChange={setField('applied_date')} />}
        </Field>
      </div>
      <Field label="Salary" error={errors.salary} hint="Optional. Whole number, no currency symbol.">
        {(props) => <Input {...props} type="number" inputMode="numeric" min="0" max={MAX_INT} step="1" value={form.salary} onChange={setField('salary')} />}
      </Field>
      <Field label="Description" error={errors.description}>
        {(props) => <Textarea {...props} value={form.description} onChange={setField('description')} placeholder="Role details, requirements, or the posting link." />}
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>Cancel</Button>
        <Button type="submit" loading={submitting}>{isEdit ? 'Save changes' : 'Add application'}</Button>
      </div>
    </form>
  );
}
