import { cn } from '../../lib/cn';

const badgeTones = {
  primary: 'badge-primary',
  accent: 'badge-accent',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  neutral: 'badge-neutral',
  info: 'badge-info',
};

export function Badge({ tone = 'neutral', className, children, ...props }) {
  return (
    <span className={cn('badge', badgeTones[tone] || badgeTones.neutral, className)} {...props}>
      {children}
    </span>
  );
}

export default Badge;
