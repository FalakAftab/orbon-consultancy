import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const Textarea = forwardRef(function Textarea(
  { className, error, hint, label, id, ...props },
  ref
) {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="field">
      {label && (
        <label className="field-label" htmlFor={textareaId}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn('input', error && 'input-error', className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {hint && !error && <span className="field-hint">{hint}</span>}
      {error && <span className="field-error">{error}</span>}
    </div>
  );
});

export default Textarea;
