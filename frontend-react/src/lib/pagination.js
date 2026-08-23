/**
 * Pagination metadata normalization for Laravel paginator responses.
 *
 * The Laravel `LengthAwarePaginator` returns pagination metadata at the TOP
 * level of the JSON payload:
 *
 *   {
 *     current_page, data, first_page_url, from, last_page, last_page_url,
 *     links, next_page_url, path, per_page, prev_page_url, to, total
 *   }
 *
 * Older/other endpoints may nest this under `meta` (and/or include `links`).
 * This helper safely reads from BOTH shapes and returns a normalised object:
 *
 *   { current_page, last_page, total, per_page, from, to }
 *
 * It returns `null` when no usable pagination metadata is present.
 */
export function normalizePagination(res) {
  if (!res || typeof res !== 'object') return null;

  const meta = res.meta && typeof res.meta === 'object' ? res.meta : {};

  const candidate = {
    current_page: res.current_page ?? meta.current_page,
    last_page: res.last_page ?? meta.last_page,
    total: res.total ?? meta.total,
    per_page: res.per_page ?? meta.per_page,
    from: res.from ?? meta.from,
    to: res.to ?? meta.to,
  };

  // Require at least `total` to consider this a real paginated response.
  if (candidate.total === undefined || candidate.total === null) return null;

  return {
    current_page: Number(candidate.current_page) || 1,
    last_page: Number(candidate.last_page) || 1,
    total: Number(candidate.total) || 0,
    per_page: Number(candidate.per_page) || 10,
    from: candidate.from === null || candidate.from === undefined ? null : Number(candidate.from),
    to: candidate.to === null || candidate.to === undefined ? null : Number(candidate.to),
  };
}
