import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * Builds a paginated list of page numbers with ellipsis for large ranges.
 */
function getPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }
  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) result.push('ellipsis');
    result.push(page);
    previous = page;
  }
  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  className,
  pageSize,
  current = currentPage,
  total = totalPages,
}) {
const activePage = currentPage ?? current ?? 1;
  const lastPage = totalPages ?? total ?? 1;
  const perPage = pageSize || 10;

  const pages = getPageItems(activePage, lastPage);

  // Compute the "Showing X–Y of Z" window from the real total & per-page.
  let showing = null;
  if (totalItems !== undefined && totalItems !== null) {
    const from = totalItems === 0 ? 0 : (activePage - 1) * perPage + 1;
    const to = Math.min(activePage * perPage, totalItems);
    showing = { from: Math.min(from, to === 0 ? 0 : totalItems), to, total: totalItems };
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mt-6">
      {showing && (
        <p className="text-sm text-muted">
          {showing.total === 0
            ? 'No items'
            : `Showing ${showing.from}–${showing.to} of ${showing.total} ${showing.total === 1 ? 'item' : 'items'}`}
        </p>
      )}
      <nav className={cn('pagination', className)} aria-label="Pagination">
        <button
          type="button"
          className="pagination-btn"
          disabled={activePage <= 1}
          onClick={() => onPageChange(activePage - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-1 text-muted">
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={cn('pagination-btn', page === activePage && 'pagination-btn-active')}
              disabled={page === activePage}
              onClick={() => onPageChange(page)}
              aria-current={page === activePage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}
        <button
          type="button"
          className="pagination-btn"
          disabled={activePage >= lastPage}
          onClick={() => onPageChange(activePage + 1)}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

export default Pagination;
