import { SkeletonCard } from '../ui';

/**
 * Suspense fallback shown during route-level code-splitting.
 */
export function PageLoader() {
  return (
    <div className="grid grid-3">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export default PageLoader;
