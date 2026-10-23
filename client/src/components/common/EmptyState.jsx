/**
 * Reusable Empty State Component
 * 
 * @param {Object} props
 * @param {string} props.title - Main header message
 * @param {string} props.description - Supplementary explanatory text
 * @param {string} [props.icon="bi-inbox"] - Bootstrap Icon class (e.g. bi-journal-x)
 * @param {React.ReactNode} [props.action] - Optional Action CTA button element
 * @param {string} [props.className=""] - Append custom styles
 */
export default function EmptyState({
  title,
  description,
  icon = 'bi-inbox',
  action,
  className = '',
  ...rest
}) {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center text-center p-5 ${className}`}
      {...rest}
    >
      <div
        className="d-flex align-items-center justify-content-center bg-light rounded-circle mb-4 text-primary"
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: 'var(--accent-soft)',
          fontSize: '2.5rem',
        }}
      >
        <i className={`bi ${icon} text-primary`}></i>
      </div>
      <h3 className="h5 fw-bold mb-2">{title}</h3>
      <p className="text-muted mx-auto mb-4" style={{ maxWidth: '320px', fontSize: '0.92rem' }}>
        {description}
      </p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
