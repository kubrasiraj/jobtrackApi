import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { getErrorMessage } from '../../utils/errors';
import Button from './Button';
import Modal from './Modal';

// `onConfirm` returns a promise. The dialog closes when it resolves and
// shows the error inline (staying open) when it rejects.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', onConfirm, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleConfirm() {
    setBusy(true);
    setError('');
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(err.friendlyMessage ?? getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  function handleClose() {
    if (busy) return;
    setError('');
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} title={title} dismissible={!busy}>
      <div className="flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <p className="pt-1.5 text-sm leading-relaxed text-slate-600">{message}</p>
      </div>
      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose} disabled={busy} data-autofocus>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} loading={busy}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
