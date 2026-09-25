import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';


import { MapPin, Building2, Search, ExternalLink } from 'lucide-react';
import { searchUniversities, saveFavorite } from '../../api/student';
import { Pagination, EmptyState, ErrorState, Button } from '../../components/ui';
import { ViewToggle } from '../../components/shared/ViewToggle';
import { formatTuitionType } from '../../lib/format';
import { useDebounce } from '../../hooks/useDebounce';
import { normalizePagination } from '../../lib/pagination';

/**
 * German Universities — real GET /v1/universities with search &
 * server-side pagination (backed by the real ~235-row dataset).
 */
const PAGE_SIZE = 12;
const VIEW_KEY = 'studypath_universities_view';

// Universities from the API don't include a photo — cycle through the
// campus photos already extracted from the design so cards aren't bare text.
const UNI_PHOTOS = [
  '/assets/landing/university-1.jpg',
  '/assets/landing/university-2.jpg',
  '/assets/landing/university-3.jpg',
  '/assets/programs/card-1.jpg',
  '/assets/programs/card-2.jpg',
  '/assets/results/card-1.jpg',
  '/assets/universities/campus-01.jpg',
  '/assets/universities/campus-02.jpg',
  '/assets/universities/campus-03.jpg',
  '/assets/universities/campus-04.jpg',
  '/assets/universities/campus-05.jpg',
  '/assets/universities/campus-06.jpg',
  '/assets/universities/campus-07.jpg',
  '/assets/universities/campus-08.jpg',
  '/assets/universities/campus-09.jpg',
  '/assets/universities/campus-10.jpg',
  '/assets/universities/campus-11.jpg',
];

export default function UniversitiesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) {
      setSearch(q);
    }
  }, [searchParams]);


  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedId, setSavedId] = useState(null);
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_KEY) || 'grid';
    } catch {
      return 'grid';
    }
  });

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        per_page: PAGE_SIZE,
        page,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      };
      const res = await searchUniversities(params);
      const data = Array.isArray(res?.data) ? res.data : [];
      setItems(data);
      // Laravel's paginator returns current_page/last_page/total at the TOP
      // level of the response, not nested under `meta` — normalizePagination
      // reads both shapes safely (see src/lib/pagination.js).
      setMeta(normalizePagination(res));
    } catch (err) {
      setError(err.message || 'Could not load universities.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);


  const handleSave = async (e, uniId) => {
    e.stopPropagation();
    try {
      await saveFavorite(uniId);
      setSavedId(uniId);
      setTimeout(() => setSavedId(null), 2500);
    } catch (err) {
      // ignore duplicates
    }
  };

  return (
    <div className="universities-page flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 600,
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-charcoal)',
            }}
          >
            German Universities
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Prestigious public and research institutions across Germany
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="search-bar" style={{ minWidth: 260 }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search universities..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <ViewToggle value={view} onChange={changeView} />
        </div>
      </div>

      {error ? (
        <ErrorState title="Could not load universities" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-2xl)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={Building2}
          title="No universities found"
          description="Try a different search term or clear the search box."
          action={<Button variant="secondary" onClick={() => setSearch('')}>Clear search</Button>}
        />
      ) : view === 'grid' ? (
        <>
          <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
            {items.map((uni, idx) => {
              const programCount = uni.program_count ?? uni.programs_count ?? 0;
              return (
                <article
                  key={uni.id}
                  className="card card-hover"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 'var(--radius-2xl)',
                    padding: 0,
                    overflow: 'hidden',
                  }}
                  onClick={() => navigate(`/student/universities/${uni.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/student/universities/${uni.id}`); }}
                  aria-label={`Explore ${uni.name}`}
                >
                  <div style={{ aspectRatio: '16 / 10' }}>
                    <img
                      src={UNI_PHOTOS[idx % UNI_PHOTOS.length]}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>

                  <div style={{ padding: '1.35rem 1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        color: 'var(--color-charcoal)',
                        lineHeight: 1.15,
                      }}
                    >
                      {uni.name}
                    </h3>
                    <p className="text-sm text-muted mt-1 flex items-center gap-1">
                      <MapPin size={12} /> {uni.city || 'Germany'}{uni.state ? `, ${uni.state}` : ''}
                    </p>

                    <div className="flex items-center justify-between gap-2 mt-3">
                      {programCount ? (
                        <span className="badge badge-primary">{programCount} Programs</span>
                      ) : <span />}
                    </div>

                    <button
                      type="button"
                      className="btn btn-sm mt-4"
                      style={{
                        width: '100%',
                        background: '#0e1b2e',
                        color: 'var(--color-ivory)',
                        border: 'none',
                        padding: '0.65rem',
                        fontWeight: 600,
                      }}
                      onClick={(e) => { e.stopPropagation(); navigate(`/student/universities/${uni.id}`); }}
                    >
                      View Details <ExternalLink size={13} />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <Pagination
            currentPage={meta?.current_page || page}
            totalPages={meta?.last_page || 1}
            totalItems={meta?.total}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
          />
        </>
      ) : (
        <>
          <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
            {items.map((uni) => {
              const programCount = uni.program_count ?? uni.programs_count ?? 0;
              return (
                <article
                  key={uni.id}
                  className="card card-hover"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    padding: '1.1rem 1.5rem',
                    borderRadius: 'var(--radius-xl)',
                    flexWrap: 'wrap',
                  }}
                  onClick={() => navigate(`/student/universities/${uni.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/student/universities/${uni.id}`); }}
                  aria-label={`Explore ${uni.name}`}
                >
                  <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                    <p className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-1">
                      <MapPin size={12} /> {uni.city || 'Germany'}{uni.state ? `, ${uni.state}` : ''}
                    </p>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        fontWeight: 600,
                        letterSpacing: 'var(--letter-spacing-tight)',
                        color: 'var(--color-charcoal)',
                        marginTop: '0.2rem',
                      }}
                    >
                      {uni.name}
                    </h3>
                    <p className="text-sm text-muted mt-1">
                      {programCount ? `${programCount} programs` : 'University'} · {formatTuitionType(uni.tuition_type) || 'Various tuition types'}
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={(e) => { e.stopPropagation(); navigate(`/student/universities/${uni.id}`); }}
                  >
                    Explore Institution <ExternalLink size={13} />
                  </button>
                </article>
              );
            })}
          </div>

          <Pagination
            currentPage={meta?.current_page || page}
            totalPages={meta?.last_page || 1}
            totalItems={meta?.total}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </div>
  );
}