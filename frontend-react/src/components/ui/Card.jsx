import { cn } from '../../lib/cn';

export function Card({ className, hover = false, children, ...props }) {
  return (
    <div className={cn('card', hover && 'card-hover', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn('card-header', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-muted', className)}>{children}</p>;
}

export function CardBody({ className, children }) {
  return <div className={cn('card-body', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return <div className={cn('card-footer', className)}>{children}</div>;
}

export default Card;
