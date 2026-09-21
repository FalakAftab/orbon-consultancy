import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapPin, Building2, Search, ExternalLink } from 'lucide-react';
import { api } from '../api/client';
import { Pagination, EmptyState, ErrorState, Button } from '../components/ui';
import { ViewToggle } from '../components/shared/ViewToggle';
import { useDebounce } from '../hooks/useDebounce';
import { normalizePagination } from '../lib/pagination';
import { Navbar } from '../components/landing/Navbar';
import { SiteFooter } from '../components/landing/SiteFooter';
import { formatTuitionType } from '../lib/format';

const PAGE_SIZE = 12;
const VIEW_KEY = 'studypath_public_universities_view';

const UNI_PHOTOS = [
  '/assets/landing/university-1.jpg',
  '/assets/landing/university-2.jpg',
  '/assets/landing/university-3.jpg',
  '/assets/programs/card-1.jpg',
  '/assets/programs/card-2.jpg',
  '/assets/results/card-1.jpg',
];

export default function PublicUniversitiesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);
  }, [searchParams]);

  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_KEY) || 'grid';
    } catch {
      return 'grid';
    }
  });

  const changeView = (next) => {
    setView(next);
    try { localStorage.setItem(VIEW_KEY, next); } catch { /* ignore */ }
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
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => qs.set(k, v));
      const res = await api(`/universities?${qs.toString()}`);
      const data = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      setItems(data);
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

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div className="universities-page flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 600, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                German Universities
              </h1>
              <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
                Explore prestigious public and research institutions across Germany.
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
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <ViewToggle value={view} onChange={changeView} />
            </div>
          </div>

          {error ? (
            <ErrorState title="Could not load universities" description={error} onRetry={load} />
          ) : loading ? (
            <div className="grid grid-3" style={{ gap: '1.5rem' }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 280, borderRadius: '16px' }} />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState icon={Building2} title="No universities found" description="Try a different search term or clear the search box." action={<Button variant="secondary" onClick={() => setSearch('')}>Clear search</Button>} />
          ) : view === 'grid' ? (
            <>
              <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                {items.map((uni, idx) => {
                  const programCount = uni.program_count ?? uni.programs_count ?? 0;
                  const photoUrl = uni.logo_url || UNI_PHOTOS[idx % UNI_PHOTOS.length];
                  
                  return (
                    <article
                      key={uni.id}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-3px)';
                        e.currentTarget.style.borderColor = '#C49746';
                        e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(15, 23, 42, 0.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = '#E2E8F0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => navigate(`/universities/${uni.id}`)}
                    >
                      <div style={{ aspectRatio: '16 / 9', overflow: 'hidden' }}>
                        <img
                          src={photoUrl}
                          alt={uni.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop"; }}
                        />
                      </div>

                      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                          {uni.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <MapPin size={13} style={{ color: '#C49746' }} /> {uni.city || 'Germany'}{uni.state ? `, ${uni.state}` : ''}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                          {programCount > 0 && (
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0F172A', background: '#F1F5F9', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                              {programCount} Programs
                            </span>
                          )}
                        </div>

                        <div style={{ marginTop: 'auto', paddingTop: '1.25rem' }}>
                          <span style={{ color: '#C49746', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            View Details <ExternalLink size={14} />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div style={{ marginTop: '2rem' }}>
                <Pagination currentPage={meta?.current_page || page} totalPages={meta?.last_page || 1} totalItems={meta?.total} onPageChange={setPage} pageSize={PAGE_SIZE} />
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col" style={{ gap: '1rem' }}>
                {items.map((uni) => {
                  const programCount = uni.program_count ?? uni.programs_count ?? 0;
                  return (
                    <article
                      key={uni.id}
                      style={{
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1.25rem 1.5rem',
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C49746'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; }}
                      onClick={() => navigate(`/universities/${uni.id}`)}
                    >
                      <div style={{ flex: '1 1 240px' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <MapPin size={12} color="#C49746" /> {uni.city || 'Germany'}{uni.state ? `, ${uni.state}` : ''}
                        </p>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 600, color: '#0F172A', marginTop: '0.25rem' }}>
                          {uni.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
                          {programCount ? `${programCount} programs` : 'University'} · {formatTuitionType(uni.tuition_type) || 'Various tuition types'}
                        </p>
                      </div>
                      <div>
                        <span style={{ color: '#C49746', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', border: '1px solid #C49746', borderRadius: '6px' }}>
                          Explore <ExternalLink size={14} />
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
              <div style={{ marginTop: '2rem' }}>
                <Pagination currentPage={meta?.current_page || page} totalPages={meta?.last_page || 1} totalItems={meta?.total} onPageChange={setPage} pageSize={PAGE_SIZE} />
              </div>
            </>
          )}
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
