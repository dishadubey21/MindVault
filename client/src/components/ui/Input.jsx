/**
 * Reusable Parameterized Input Component
 * 
 * @param {Object} props
 * @param {string} props.name - Field identifier
 * @param {string} [props.label] - Field visual title
 * @param {string} [props.type="text"] - Text, password, email, number, etc.
 * @param {string|number} [props.value] - State variable value
 * @param {function} [props.onChange] - OnChange hook function
 * @param {string} [props.placeholder] - Input helper placeholder
 * @param {string} [props.error] - Validation error message text
 * @param {string} [props.helperText] - Supplementary user guidance text
 * @param {boolean} [props.disabled=false] - Lock field editing state
 * @param {boolean} [props.required=false] - Display visual asterisk indicator
 * @param {string} [props.className=""] - Custom wrapper classes
 */
export default function Input({
  name,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  ...rest
}) {
  return (
    <div className={`custom-input-group mb-3 ${className}`}>
      {label && (
        <label htmlFor={`input-${name}`} className="input-label">
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      )}
      <input
        id={`input-${name}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`form-control custom-input ${error ? 'is-invalid' : ''}`}
        {...rest}
      />
      {error && <div className="input-error-text mt-1">{error}</div>}
      {!error && helperText && (
        <small className="form-text text-muted mt-1 d-block">{helperText}</small>
      )}
    </div>
  );
}
