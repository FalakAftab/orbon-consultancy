import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Select = forwardRef(function Select(
  { className, error, hint, label, id, children, ...props },
  ref
) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={selectId}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={cn('input select', error && 'input-error', className)}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {children}
      </select>
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
});

export default Select;
