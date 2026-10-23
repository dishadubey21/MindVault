import { useState, useEffect } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

// Load mock data on mount
const MOCK_NOTES = [
  {
    id: 1,
    title: 'Architectural Decisions',
    content: 'Using MVC-S on backend and Custom CSS styling variables matching Bootstrap utilities on client.',
    updatedAt: '2 mins ago',
    tags: ['architecture', 'docs'],
  },
  {
    id: 2,
    title: 'Razorpay Settings',
    content: 'Subscription set to ₹1 for 6 months duration in test environments.',
    updatedAt: '1 hour ago',
    tags: ['billing', 'config'],
  },
  {
    id: 3,
    title: 'OWASP Security Steps',
    content: 'Standard cookie configs: HttpOnly, Secure, Strict SameSite setups.',
    updatedAt: 'Yesterday',
    tags: ['security', 'owasp'],
  },
];

/**
 * MindVault Interactive Workspace Dashboard View
 */
export default function Dashboard() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setNotes(MOCK_NOTES);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const triggerReload = () => {
    setIsLoading(true);
    setNotes([]);
    setTimeout(() => {
      setNotes(MOCK_NOTES);
      setIsLoading(false);
    }, 1200);
  };

  const clearAllNotes = () => {
    setNotes([]);
  };

  return (
    <div className="container py-4">
      {/* Header Actions Panel */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <h2 className="mb-1 fw-bold text-primary">Personal Workspace</h2>
          <p className="text-secondary small mb-0">Manage your indexed memories and attachments</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Button variant="secondary" onClick={triggerReload} disabled={isLoading}>
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </Button>
          {notes.length > 0 && (
            <Button variant="danger" onClick={clearAllNotes} disabled={isLoading}>
              <i className="bi bi-trash me-1"></i> Clear Workspace
            </Button>
          )}
          <div className="btn-group border border-color rounded-2 overflow-hidden bg-white">
            <button
              className={`btn btn-sm py-2 px-3 border-0 ${viewMode === 'grid' ? 'btn-brand-primary' : 'bg-transparent text-secondary'}`}
              onClick={() => setViewMode('grid')}
            >
              <i className="bi bi-grid-fill"></i>
            </button>
            <button
              className={`btn btn-sm py-2 px-3 border-0 ${viewMode === 'list' ? 'btn-brand-primary' : 'bg-transparent text-secondary'}`}
              onClick={() => setViewMode('list')}
            >
              <i className="bi bi-list-task"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="py-4">
          <LoadingSkeleton variant={viewMode === 'grid' ? 'card' : 'list'} rows={3} />
        </div>
      ) : notes.length === 0 ? (
        <Card className="border border-color shadow-sm py-5">
          <EmptyState
            title="Your Vault is Empty"
            description="Create your first rich-text note or upload document attachments to get started."
            icon="bi-journal-x"
            action={
              <Button variant="primary" onClick={triggerReload}>
                <i className="bi bi-plus-circle me-1"></i> Load Demo Data
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="py-2">
          {viewMode === 'grid' ? (
            <div className="row g-4">
              {notes.map((note) => (
                <div key={note.id} className="col-12 col-md-6 col-lg-4">
                  <Card
                    title={note.title}
                    subtitle={`Last edited ${note.updatedAt}`}
                    footer={
                      <div className="d-flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <span key={tag} className="badge bg-light text-primary border border-color px-2.5 py-1.5 rounded-pill">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    }
                  >
                    <p className="card-text text-secondary text-truncate-lines-3 mb-0" style={{ fontSize: '0.94rem', lineHeight: '1.6' }}>
                      {note.content}
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="d-flex flex-wrap align-items-center justify-content-between p-3 border border-color rounded-3 bg-secondary"
                  style={{ backgroundColor: 'var(--bg-secondary)', transition: 'var(--transition-all)' }}
                >
                  <div className="d-flex flex-column gap-1 w-70">
                    <h4 className="h6 fw-bold mb-1">{note.title}</h4>
                    <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '480px' }}>{note.content}</p>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="d-flex gap-1 d-none d-md-flex">
                      {note.tags.map((tag) => (
                        <span key={tag} className="badge bg-light text-primary border border-color px-2 rounded-pill">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <small className="text-secondary">{note.updatedAt}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
