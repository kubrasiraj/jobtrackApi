import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Card from '../components/ui/Card';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <Card>
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        action={<Link to="/"><Button>Back to dashboard</Button></Link>}
      />
    </Card>
  );
}
