import { useState } from 'react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { Field, Input, Select, Textarea } from '../ui/Field';
import Modal from '../ui/Modal';
import { useToast } from '../../hooks/useToast';
import { interviewService } from '../../services/interviewService';
import { INTERVIEW_STATUSES, INTERVIEW_TYPES, MAX_INT } from '../../utils/constants';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { blankToNull, fromDateTimeInput, toDateTimeInput } from '../../utils/format';

function InterviewForm({ interview, applicationId, applications, suggestedRound, onSaved, onClose }) {
  const toast = useToast();
  const isEdit = Boolean(interview);
  const [form, setForm] = useState({
    application_id: applicationId ? String(applicationId) : '',
    round: String(interview?.round ?? suggestedRound ?? 1),
    scheduled_at: toDateTimeInput(interview?.scheduled_at),
    interview_type: interview?.interview_type ?? INTERVIEW_TYPES[0],
    status: interview?.status ?? 'SCHEDULED',
    feedback: interview?.feedback ?? '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }));
  const needsApplicationPicker = !isEdit && !applicationId;

  const types = INTERVIEW_TYPES.includes(form.interview_type) ? INTERVIEW_TYPES : [form.interview_type, ...INTERVIEW_TYPES];
  const statuses = INTERVIEW_STATUSES.some((s) => s.value === form.status)
    ? INTERVIEW_STATUSES
    : [{ value: form.status, label: form.status }, ...INTERVIEW_STATUSES];

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (needsApplicationPicker && !form.application_id) nextErrors.application_id = 'Select an application.';
    if (!Number.isInteger(Number(form.round)) || Number(form.round) < 1 || Number(form.round) > MAX_INT) {
      nextErrors.round = 'Enter a whole round number, 1 or more.';
    }
    if (!form.scheduled_at) nextErrors.scheduled_at = 'Select a date and time.';
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const payload = {
        round: Number(form.round),
        scheduled_at: fromDateTimeInput(form.scheduled_at),
        interview_type: form.interview_type,
        status: form.status,
        feedback: blankToNull(form.feedback),
      };
      if (isEdit) await interviewService.update(interview.id, payload);
      else await interviewService.create(Number(form.application_id), payload);
      toast.success(isEdit ? 'Interview updated.' : 'Interview scheduled.');
      onSaved();
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && <Alert>{formError}</Alert>}
      {needsApplicationPicker && (
        <Field label="Application" required error={errors.application_id}>
          {(props) => (
            <Select {...props} value={form.application_id} onChange={setField('application_id')}>
              <option value="">Select an application</option>
              {applications.map((application) => <option key={application.id} value={application.id}>{application.label}</option>)}
            </Select>
          )}
        </Field>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Round" required error={errors.round}>
          {(props) => <Input {...props} type="number" min="1" step="1" value={form.round} onChange={setField('round')} />}
        </Field>
        <Field label="Date and time" required error={errors.scheduled_at}>
          {(props) => <Input {...props} type="datetime-local" value={form.scheduled_at} onChange={setField('scheduled_at')} />}
        </Field>
        <Field label="Type" required error={errors.interview_type}>
          {(props) => (
            <Select {...props} value={form.interview_type} onChange={setField('interview_type')}>
              {types.map((type) => <option key={type} value={type}>{type}</option>)}
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
      </div>
      <Field label="Feedback" error={errors.feedback} hint="Optional. Add your impressions after the interview.">
        {(props) => <Textarea {...props} value={form.feedback} onChange={setField('feedback')} />}
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button type="submit" loading={submitting}>{isEdit ? 'Save changes' : 'Schedule interview'}</Button>
      </div>
    </form>
  );
}

// `interview` is null when creating. Pass `applications` ([{ id, label }]) to
// let the user choose the application, or `applicationId` when it is known.
export default function InterviewFormModal({ open, interview, applicationId, applications = [], suggestedRound, onSaved, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={interview ? 'Edit interview' : 'Schedule interview'}>
      {open && (
        <InterviewForm
          interview={interview}
          applicationId={applicationId}
          applications={applications}
          suggestedRound={suggestedRound}
          onSaved={onSaved}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}
