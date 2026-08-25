import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';
import { cn } from '../../lib/cn';

export function ErrorState({
  title = 'Something went wrong',
  description,
  onRetry,
  className,
}) {
  return (
    <div className={cn('state-wrap', className)}>
      <span className="state-icon" style={{ background: 'var(--color-danger-50)', color: 'var(--color-danger)' }}>
        <AlertCircle size={24} />
      </span>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        {description && (
          <p className="text-sm text-muted mt-2 max-w-sm mx-auto">{description}</p>
        )}
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-2">
          <RefreshCw size={16} />
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
