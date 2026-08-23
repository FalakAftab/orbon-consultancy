import { cn } from '../../lib/cn';

export function PageHeader({ title, description, actions, className }) {
  return (
    <div className={cn('page-header', className)}>
      <div>
        {title && <h1 className="text-2xl font-semibold">{title}</h1>}
        {description && <p className="text-muted mt-1 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>}
    </div>
  );
}

export default PageHeader;
