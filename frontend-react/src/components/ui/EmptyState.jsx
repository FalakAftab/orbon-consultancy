import { Inbox } from 'lucide-react';
import { cn } from '../../lib/cn';

export function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
  className,
}) {
  return (
    <div className={cn('state-wrap', className)}>
      <span className="state-icon">
        <Icon size={24} />
      </span>
      <div>
        <h4 className="text-lg font-semibold">{title}</h4>
        {description && (
          <p className="text-sm text-muted mt-2 max-w-sm mx-auto">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export default EmptyState;
