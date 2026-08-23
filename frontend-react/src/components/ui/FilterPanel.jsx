import { cn } from '../../lib/cn';

/**
 * A flexible filter container. Children (typically Select/Input fields)
 * are laid out in a responsive wrap with an optional reset action.
 */
export function FilterPanel({ onReset, children, className, showReset = true }) {
  return (
    <div className={cn('filter-panel', className)}>
      {children}
      {showReset && onReset && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={onReset}>
          Reset filters
        </button>
      )}
    </div>
  );
}

export default FilterPanel;
