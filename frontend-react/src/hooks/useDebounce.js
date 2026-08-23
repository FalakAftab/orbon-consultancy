import { useEffect, useState } from 'react';

/**
 * Returns a debounced value that updates only after `delay` ms have
 * passed without the source value changing. Useful for search inputs
 * that trigger API calls.
 */
export function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
