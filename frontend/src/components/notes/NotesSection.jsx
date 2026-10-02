import { useState } from 'react';
import { NotebookPen, Pencil, Plus, Trash2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import Button from '../ui/Button';
import Card, { CardHeader } from '../ui/Card';
import ConfirmDialog from '../ui/ConfirmDialog';
import NoteFormModal from './NoteFormModal';
import { useToast } from '../../hooks/useToast';
import { noteService } from '../../services/noteService';
import { formatTimestamp } from '../../utils/format';

export default function NotesSection({ applicationId, notes, onChanged }) {
  const toast = useToast();
  const [formState, setFormState] = useState(null); // { note } | null
  const [toDelete, setToDelete] = useState(null);

  async function handleDelete() {
    await noteService.remove(toDelete.id);
    toast.success('Note deleted.');
    onChanged();
  }

  return (
    <Card>
      <CardHeader
        title="Notes"
        description="Private context for this application."
        action={<Button size="sm" variant="secondary" icon={Plus} onClick={() => setFormState({ note: null })}>Add note</Button>}
      />
      {notes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notes yet"
          description="Capture recruiter details, prep ideas or follow-ups."
          action={<Button size="sm" icon={Plus} onClick={() => setFormState({ note: null })}>Add your first note</Button>}
        />
      ) : (
        <ul className="space-y-3 p-4">
          {notes.map((note) => (
            <li key={note.id} className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-800">{note.content}</p>
              <div className="mt-3 flex items-center justify-between border-t border-slate-200/70 pt-2.5">
                <p className="text-xs text-slate-500">{formatTimestamp(note.created_at)}</p>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" aria-label="Edit note" onClick={() => setFormState({ note })}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="danger-ghost" size="icon" aria-label="Delete note" onClick={() => setToDelete(note)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <NoteFormModal
        open={Boolean(formState)}
        applicationId={applicationId}
        note={formState?.note ?? null}
        onClose={() => setFormState(null)}
        onSaved={() => {
          setFormState(null);
          onChanged();
        }}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete note"
        message="Delete this note? This cannot be undone."
        onConfirm={handleDelete}
      />
    </Card>
  );
}
