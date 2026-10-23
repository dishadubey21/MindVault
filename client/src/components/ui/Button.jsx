import Spinner from './Spinner';

/**
 * Reusable Custom Styled UI Button
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Inside content / label
 * @param {string} [props.type="button"] - Standard button types (submit, button, reset)
 * @param {string} [props.variant="primary"] - Visual category (primary, secondary, danger)
 * @param {boolean} [props.loading=false] - Displays a spin loader and disables triggers
 * @param {boolean} [props.disabled=false] - Disabled attribute
 * @param {function} [props.onClick] - Click listener trigger
 * @param {string} [props.className=""] - Append custom styles
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  // Map variant identifiers to CSS rules
  const variantClasses = {
    primary: 'btn-brand-primary',
    secondary: 'btn-brand-secondary',
    danger: 'btn-brand-danger',
  };

  const selectedClass = variantClasses[variant] || variantClasses.primary;
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`btn ${selectedClass} d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...rest}
    >
      {loading && <Spinner size="sm" color="current" />}
      <span>{children}</span>
    </button>
  );
}
