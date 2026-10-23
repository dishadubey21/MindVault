import Card from '../components/ui/Card';
import EmptyState from '../components/common/EmptyState';

/**
 * Trash List Page (Milestone 1 framework layout)
 */
export default function Trash() {
  return (
    <div className="container py-4">
      <h2 className="mb-1 fw-bold text-primary">Trash Bin</h2>
      <p className="text-secondary small mb-4">Recover deleted notes or purge them forever</p>
      
      <Card className="border border-color shadow-sm py-5">
        <EmptyState
          title="Trash is Empty"
          description="Deleted notes will appear here. Items can be restored or deleted permanently."
          icon="bi-trash"
        />
      </Card>
    </div>
  );
}
