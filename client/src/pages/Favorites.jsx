import Card from '../components/ui/Card';
import EmptyState from '../components/common/EmptyState';

/**
 * Favorites List Page (Milestone 1 framework layout)
 */
export default function Favorites() {
  return (
    <div className="container py-4">
      <h2 className="mb-1 fw-bold text-primary">Favorites</h2>
      <p className="text-secondary small mb-4">View your pinned and favorited items</p>
      
      <Card className="border border-color shadow-sm py-5">
        <EmptyState
          title="No Favorited Notes"
          description="Mark important notes as favorites to display them in this section."
          icon="bi-star"
        />
      </Card>
    </div>
  );
}
