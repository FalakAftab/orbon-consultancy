import { forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '../../lib/cn';

const SearchBar = forwardRef(function SearchBar(
  { value, onChange, onClear, placeholder = 'Search…', className, ...props },
  ref
) {
  return (
    <div className={cn('search-bar', className)}>
      <Search className="search-icon" size={16} />
      <input
        ref={ref}
        type="search"
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="btn btn-ghost btn-icon btn-sm"
          style={{ position: 'absolute', right: 4 }}
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
});

export default SearchBar;
