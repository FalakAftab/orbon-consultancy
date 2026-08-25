import { cn } from '../../lib/cn';

export function Spinner({ size = 'md', className, ...props }) {
  return (
    <span
      className={cn(
        'spinner',
        size === 'sm' && 'spinner-sm',
        size === 'lg' && 'spinner-lg',
        className
      )}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
}

export default Spinner;
