/**
 * Reusable Glassmorphism Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Inside content nodes
 * @param {React.ReactNode|string} [props.title] - Card header title text/node
 * @param {React.ReactNode|string} [props.subtitle] - Minor card header note
 * @param {React.ReactNode} [props.headerActions] - Actions aligned to the right of header
 * @param {React.ReactNode} [props.footer] - Card footer content
 * @param {string} [props.className=""] - Wrapper custom styles
 * @param {string} [props.bodyClassName=""] - Inner body custom styles
 */
export default function Card({
  children,
  title,
  subtitle,
  headerActions,
  footer,
  className = '',
  bodyClassName = '',
  ...rest
}) {
  return (
    <div className={`card glass-card h-100 ${className}`} {...rest}>
      {(title || subtitle || headerActions) && (
        <div className="card-header bg-transparent border-bottom border-color d-flex justify-content-between align-items-center py-3 px-4">
          <div>
            {title && <h3 className="card-title h5 mb-0 fw-bold">{title}</h3>}
            {subtitle && <small className="text-muted d-block mt-1">{subtitle}</small>}
          </div>
          {headerActions && <div className="card-actions">{headerActions}</div>}
        </div>
      )}
      
      <div className={`card-body p-4 ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className="card-footer bg-transparent border-top border-color py-3 px-4">
          {footer}
        </div>
      )}
    </div>
  );
}
