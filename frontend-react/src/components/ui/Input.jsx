import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Input = forwardRef(function Input(
  { className, error, hint, label, id, ...props },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={cn('input', error && 'input-error', className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
});

export default Input;
