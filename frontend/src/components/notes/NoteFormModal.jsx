import { useState } from 'react';
import Alert from '../ui/Alert';
import Button from '../ui/Button';
import { Field, Textarea } from '../ui/Field';
import Modal from '../ui/Modal';
import { useToast } from '../../hooks/useToast';
import { noteService } from '../../services/noteService';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';

function NoteForm({ applicationId, note, onSaved, onClose }) {
  const toast = useToast();
  const [content, setContent] = useState(note?.content ?? '');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) {
      setErrors({ content: 'Write something before saving.' });
      return;
    }
    setErrors({});
    setFormError('');
    setSubmitting(true);
    try {
      const payload = { content: content.trim() };
      if (note) await noteService.update(note.id, payload);
      else await noteService.create(applicationId, payload);
      toast.success(note ? 'Note updated.' : 'Note added.');
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
      <Field label="Note" required error={errors.content}>
        {(props) => <Textarea {...props} rows={6} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Recruiter name, prep ideas, questions to ask..." />}
      </Field>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="secondary" onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button type="submit" loading={submitting}>{note ? 'Save changes' : 'Add note'}</Button>
      </div>
    </form>
  );
}

// `note` is null when creating a new note.
export default function NoteFormModal({ open, applicationId, note, onSaved, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title={note ? 'Edit note' : 'Add note'}>
      {open && <NoteForm applicationId={applicationId} note={note} onSaved={onSaved} onClose={onClose} />}
    </Modal>
  );
}
