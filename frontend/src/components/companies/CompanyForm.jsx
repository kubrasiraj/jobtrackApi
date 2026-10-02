import { useState } from 'react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { Field, Input } from '../ui/Field';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { blankToNull } from '../../utils/format';

export default function CompanyForm({ initial, onSubmit, onCancel }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    industry: initial?.industry ?? '',
    website: initial?.website ?? '',
    location: initial?.location ?? '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Enter the company name.' });
      return;
    }
    setErrors({});
    setFormError('');
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        industry: blankToNull(form.industry),
        website: blankToNull(form.website),
        location: blankToNull(form.location),
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
      <Field label="Company name" required error={errors.name}>
        {(props) => <Input {...props} maxLength={150} value={form.name} onChange={setField('name')} placeholder="Acme Inc." />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Industry" error={errors.industry}>
          {(props) => <Input {...props} maxLength={100} value={form.industry} onChange={setField('industry')} placeholder="Software" />}
        </Field>
        <Field label="Location" error={errors.location}>
          {(props) => <Input {...props} maxLength={150} value={form.location} onChange={setField('location')} placeholder="Karachi, Pakistan" />}
        </Field>
      </div>
      <Field label="Website" error={errors.website}>
        {(props) => <Input {...props} maxLength={255} value={form.website} onChange={setField('website')} placeholder="https://example.com" />}
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={submitting}>Cancel</Button>
        <Button type="submit" loading={submitting}>{isEdit ? 'Save changes' : 'Add company'}</Button>
      </div>
    </form>
  );
}
