import { useState } from 'react';
import { CalendarClock, Plus } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import Button from '../ui/Button';
import Card, { CardHeader } from '../ui/Card';
import ConfirmDialog from '../ui/ConfirmDialog';
import InterviewCard from './InterviewCard';
import InterviewFormModal from './InterviewFormModal';
import { useToast } from '../../hooks/useToast';
import { interviewService } from '../../services/interviewService';

export default function InterviewsSection({ applicationId, interviews, onChanged }) {
  const toast = useToast();
  const [formState, setFormState] = useState(null); // { interview } | null
  const [toDelete, setToDelete] = useState(null);

  const suggestedRound = interviews.reduce((max, item) => Math.max(max, item.round), 0) + 1;

  async function handleDelete() {
    await interviewService.remove(toDelete.id);
    toast.success('Interview deleted.');
    onChanged();
  }

  return (
    <Card>
      <CardHeader
        title="Interviews"
        description="Rounds scheduled for this application."
        action={<Button size="sm" variant="secondary" icon={Plus} onClick={() => setFormState({ interview: null })}>Add interview</Button>}
      />
      {interviews.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="No interviews scheduled"
          description="When a round is booked, add it here to keep track."
          action={<Button size="sm" icon={Plus} onClick={() => setFormState({ interview: null })}>Add interview</Button>}
        />
      ) : (
        <div className="divide-y divide-slate-100">
          {interviews.map((interview) => (
            <InterviewCard key={interview.id} interview={interview} onEdit={(item) => setFormState({ interview: item })} onDelete={setToDelete} />
          ))}
        </div>
      )}

      <InterviewFormModal
        open={Boolean(formState)}
        interview={formState?.interview ?? null}
        applicationId={applicationId}
        suggestedRound={suggestedRound}
        onClose={() => setFormState(null)}
        onSaved={() => {
          setFormState(null);
          onChanged();
        }}
      />
      <ConfirmDialog
        open={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Delete interview"
        message={toDelete && `Delete the round ${toDelete.round} interview? This cannot be undone.`}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
