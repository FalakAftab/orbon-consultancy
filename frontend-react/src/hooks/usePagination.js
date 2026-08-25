import { useEffect, useMemo, useState } from 'react';

/**
 * Client-side pagination hook. Given a list of items and a page size,
 * returns the current page slice plus navigation helpers.
 */
export function usePagination(items, pageSize = 12) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((items?.length || 0) / pageSize)),
    [items, pageSize]
  );

  // Clamp page to valid range when items or pageSize change.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [totalPages, page]);

  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items?.slice(start, start + pageSize) || [];
  }, [items, currentPage, pageSize]);

  const goToPage = (next) => {
    const target = Number(next);
    if (Number.isNaN(target)) return;
    setPage(Math.min(Math.max(target, 1), totalPages));
  };

  const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return {
    currentPage,
    totalPages,
    pageItems,
    goToPage,
    nextPage,
    prevPage,
    setPage,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    totalItems: items?.length || 0,
  };
}
