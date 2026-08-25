import { LayoutGrid, List } from 'lucide-react';

/**
 * Grid/List view toggle — shared across Results, Programs, and
 * Universities pages so the control looks and behaves identically
 * everywhere it appears.
 */
export function ViewToggle({ value, onChange }) {
  return (
    <div
      role="group"
      aria-label="View mode"
      style={{
        display: 'inline-flex',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        background: 'var(--color-surface)',
      }}
    >
      {[
        { id: 'grid', label: 'Grid', icon: LayoutGrid },
        { id: 'list', label: 'List', icon: List },
      ].map((opt) => {
        const Icon = opt.icon;
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 1rem',
              fontSize: '0.8125rem',
              fontWeight: active ? 600 : 400,
              color: active ? 'var(--color-forest)' : 'var(--color-muted)',
              background: active ? 'rgba(11,59,54,0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Icon size={14} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default ViewToggle;