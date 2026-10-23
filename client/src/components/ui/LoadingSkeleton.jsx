/**
 * Reusable Loading Skeleton Component
 * 
 * @param {Object} props
 * @param {string} [props.variant="text"] - Layout types: text, card, list
 * @param {number} [props.rows=3] - Quantity of records/rows to generate
 * @param {string} [props.className=""] - Extra custom styles
 */
export default function LoadingSkeleton({
  variant = 'text',
  rows = 3,
  className = '',
  ...rest
}) {
  const rowArray = Array.from({ length: rows });

  // 1. Text paragraph rows skeleton
  if (variant === 'text') {
    return (
      <div className={`d-flex flex-column gap-2 ${className}`} {...rest}>
        {rowArray.map((_, index) => {
          // Give lines a slight random length distribution for realism
          const widths = ['100%', '92%', '85%', '95%', '65%'];
          const width = widths[index % widths.length];
          return (
            <span
              key={index}
              className="skeleton-item skeleton-pulse"
              style={{ width, height: '14px' }}
            />
          );
        })}
      </div>
    );
  }

  // 2. Card grid panels skeleton
  if (variant === 'card') {
    return (
      <div className={`row g-4 ${className}`} {...rest}>
        {rowArray.map((_, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="card glass-card p-4 h-100 border border-color">
              <div className="d-flex justify-content-between mb-3">
                <span
                  className="skeleton-item skeleton-pulse"
                  style={{ width: '60%', height: '20px' }}
                />
                <span
                  className="skeleton-item skeleton-pulse rounded-circle"
                  style={{ width: '24px', height: '24px' }}
                />
              </div>
              <div className="d-flex flex-column gap-2 mb-4">
                <span className="skeleton-item skeleton-pulse" style={{ height: '12px' }} />
                <span className="skeleton-item skeleton-pulse" style={{ height: '12px' }} />
                <span className="skeleton-item skeleton-pulse" style={{ width: '80%', height: '12px' }} />
              </div>
              <div className="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-color">
                <span
                  className="skeleton-item skeleton-pulse"
                  style={{ width: '30%', height: '12px' }}
                />
                <span
                  className="skeleton-item skeleton-pulse"
                  style={{ width: '25%', height: '12px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 3. Row records listing skeleton
  if (variant === 'list') {
    return (
      <div className={`d-flex flex-column gap-3 ${className}`} {...rest}>
        {rowArray.map((_, index) => (
          <div
            key={index}
            className="d-flex align-items-center justify-content-between p-3 border border-color rounded-3 bg-white"
            style={{ backgroundColor: 'var(--bg-secondary)' }}
          >
            <div className="d-flex align-items-center gap-3 w-70">
              <span
                className="skeleton-item skeleton-pulse rounded-2"
                style={{ width: '40px', height: '40px', flexShrink: 0 }}
              />
              <div className="d-flex flex-column gap-2 w-100">
                <span className="skeleton-item skeleton-pulse" style={{ width: '40%', height: '14px' }} />
                <span className="skeleton-item skeleton-pulse" style={{ width: '70%', height: '10px' }} />
              </div>
            </div>
            <span
              className="skeleton-item skeleton-pulse"
              style={{ width: '80px', height: '16px' }}
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
