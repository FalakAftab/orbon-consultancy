import { useNavigate } from 'react-router-dom';
import { Sparkles, History, BookmarkCheck, ArrowRight } from 'lucide-react';

/**
 * Premium quick action shortcuts for the Student Dashboard.
 * History and Shortlist are disabled placeholders until those pages are built.
 */

const actions = [
  {
    icon: Sparkles,
    label: 'Build a Recommendation',
    shortLabel: 'Recommend',
    desc: 'Get matched with programs',
    to: '/student/wizard',
    active: true,
  },
  {
    icon: BookmarkCheck,
    label: 'My Shortlist',
    shortLabel: 'Shortlist',
    desc: 'Saved programs',
    to: '/student/shortlist',
    active: true,
  },
  {
    icon: History,
    label: 'Recommendation History',
    shortLabel: 'History',
    desc: 'Your past searches',
    to: '/student/history',
    active: true,
  },
];

export function QuickActions({ compact = false }) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <div className="quick-actions-mobile-grid" aria-label="Quick Actions">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              disabled={!action.active}
              onClick={() => action.to && navigate(action.to)}
              className="quick-action-mobile-btn"
              id={`quick-action-mobile-${action.shortLabel.toLowerCase()}`}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(15, 23, 42, 0.08)',
                  color: 'var(--color-forest)',
                }}
              >
                <Icon size={18} aria-hidden="true" />
              </span>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-charcoal)',
                  lineHeight: 1.2,
                }}
              >
                {action.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-2xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-family)',
            fontSize: '0.72rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--color-muted)',
          }}
        >
          Quick Actions
        </p>
      </div>

      {/* Action list */}
      <div style={{ padding: '0.5rem 0' }}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              type="button"
              disabled={!action.active}
              onClick={() => action.to && navigate(action.to)}
              title={!action.active ? 'Coming soon' : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.875rem',
                width: '100%',
                padding: '0.875rem 1.5rem',
                background: 'transparent',
                border: 'none',
                borderRadius: 0,
                cursor: action.active ? 'pointer' : 'not-allowed',
                opacity: action.active ? 1 : 0.45,
                transition: 'background 150ms ease',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => {
                if (action.active) e.currentTarget.style.background = 'var(--color-surface-subtle)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              id={`quick-action-${action.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: action.active
                    ? 'rgba(15, 23, 42, 0.08)'
                    : 'var(--color-surface-subtle)',
                  color: action.active ? 'var(--color-forest)' : 'var(--color-muted)',
                  flexShrink: 0,
                }}
              >
                <Icon size={15} aria-hidden="true" />
              </span>

              <span style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-family)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: action.active ? 'var(--color-charcoal)' : 'var(--color-muted)',
                    letterSpacing: '0.01em',
                  }}
                >
                  {action.label}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.76rem',
                    color: 'var(--color-text-faint)',
                    marginTop: '0.1rem',
                  }}
                >
                  {action.desc}
                </span>
              </span>

              {action.active && (
                <ArrowRight
                  size={13}
                  aria-hidden="true"
                  style={{ color: 'var(--color-muted)', flexShrink: 0 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
