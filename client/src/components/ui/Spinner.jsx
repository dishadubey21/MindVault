/**
 * Reusable Spinner Component
 * 
 * @param {Object} props
 * @param {string} [props.size="md"] - Size options: sm, md, lg
 * @param {string} [props.color="primary"] - Color variants: primary, secondary, light, current (inherits textColor)
 * @param {string} [props.className=""] - Extra custom styles
 */
export default function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
  ...rest
}) {
  // Dimension definitions
  const sizeMap = {
    sm: { width: '1rem', height: '1rem', border: '0.15em' },
    md: { width: '2rem', height: '2rem', border: '0.2em' },
    lg: { width: '3.5rem', height: '3.5rem', border: '0.3em' },
  };

  // Color classes
  const colorMap = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    light: 'text-light',
    current: '', // Inherits color from parent node
  };

  const dimensions = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.primary;

  // If using current color, we can let CSS inherit border color
  const borderStyle = color === 'current' ? {} : {};

  return (
    <div
      className={`spinner-border ${colorClass} ${className}`}
      role="status"
      style={{
        width: dimensions.width,
        height: dimensions.height,
        borderWidth: dimensions.border,
        ...borderStyle
      }}
      {...rest}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
