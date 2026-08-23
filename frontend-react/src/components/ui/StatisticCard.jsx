import { cn } from '../../lib/cn';

const toneStyles = {
  primary: { background: 'var(--color-primary-50)', color: 'var(--color-primary-600)' },
  accent: { background: 'var(--color-accent-50)', color: 'var(--color-accent-600)' },
  success: { background: 'var(--color-success-50)', color: '#15803d' },
  warning: { background: 'var(--color-warning-50)', color: '#b45309' },
  danger: { background: 'var(--color-danger-50)', color: 'var(--color-danger-600)' },
  neutral: { background: 'var(--color-surface-subtle)', color: 'var(--color-text-secondary)' },
};

export function StatisticCard({
  label,
  value,
  icon: Icon,
  tone = 'primary',
  hint,
  className,
  loading = false,
}) {
  const style = toneStyles[tone] || toneStyles.primary;

  return (
    <div className={cn('card stat-card card-hover', className)}>
      {Icon && (
        <span className="stat-icon" style={style}>
          <Icon size={20} />
        </span>
      )}
      <div className="flex-1 min-w-0">
        {loading ? (
          <div className="skeleton h-7 w-16" />
        ) : (
          <div className="stat-value">{value}</div>
        )}
        <div className="stat-label">{label}</div>
        {hint && <div className="text-xs text-faint mt-1">{hint}</div>}
      </div>
    </div>
  );
}

export default StatisticCard;
