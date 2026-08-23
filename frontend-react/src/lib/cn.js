import { clsx } from 'clsx';

/**
 * Combines class names. Accepts strings, arrays, and conditional objects.
 * Used across all components for ergonomic class composition.
 */
export function cn(...inputs) {
  return clsx(inputs);
}
