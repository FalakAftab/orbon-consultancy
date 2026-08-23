import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';

const Button = forwardRef(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    children,
    disabled,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'btn',
        `btn-${variant}`,
        size === 'sm' && 'btn-sm',
        size === 'lg' && 'btn-lg',
        size === 'icon' && 'btn-icon',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
});

export default Button;
