import { useCallback, useState } from 'react';

/**
 * Manages open/close state for modals, drawers, dropdowns, etc.
 * Returns the state and memoized open/close/toggle handlers, plus an
 * onOpenChange callback suitable for controlled components.
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const onOpenChange = useCallback((next) => setIsOpen(Boolean(next)), []);

  return { isOpen, open, close, toggle, onOpenChange };
}
