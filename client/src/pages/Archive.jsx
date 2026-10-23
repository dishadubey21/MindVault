import Card from '../components/ui/Card';
import EmptyState from '../components/common/EmptyState';

/**
 * Archive List Page (Milestone 1 framework layout)
 */
export default function Archive() {
  return (
    <div className="container py-4">
      <h2 className="mb-1 fw-bold text-primary">Archive</h2>
      <p className="text-secondary small mb-4">Store notes away from your active dashboard</p>
      
      <Card className="border border-color shadow-sm py-5">
        <EmptyState
          title="Archive is Empty"
          description="Send notes you are not actively editing to the archive to keep things clean."
          icon="bi-archive"
        />
      </Card>
    </div>
  );
}
