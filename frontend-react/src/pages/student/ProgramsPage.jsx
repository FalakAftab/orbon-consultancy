import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, GraduationCap, ExternalLink, Bookmark, MapPin } from 'lucide-react';
import { searchPrograms, saveShortlist } from '../../api/student';
import { Pagination, EmptyState, ErrorState, Button, Select } from '../../components/ui';
import { ViewToggle } from '../../components/shared/ViewToggle';
import { formatDegreeLevel, formatLanguage, formatTuitionType, formatIntake } from '../../lib/format';
import { useDebounce } from '../../hooks/useDebounce';
import { normalizePagination } from '../../lib/pagination';

/**
 * German Degree Programs — real GET /v1/programs with search, filters &
 * server-side pagination (backed by the real ~2262-row dataset).
 */
const PAGE_SIZE = 12;
const VIEW_KEY = 'studypath_programs_view';

export default function ProgramsPage() {
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

  const [degreeLevel, setDegreeLevel] = useState('');
  const [intake, setIntake] = useState('');
  const [language, setLanguage] = useState('');
  const [tuition, setTuition] = useState('');

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
        ...(degreeLevel ? { degree_level: degreeLevel } : {}),
        ...(intake ? { intake } : {}),
        ...(language ? { language_of_instruction: language } : {}),
        ...(tuition ? { tuition_type: tuition } : {}),
      };
      const res = await searchPrograms(params);
      const data = Array.isArray(res?.data) ? res.data : [];
      setItems(data);
      // Laravel's paginator returns current_page/last_page/total at the TOP
      // level of the response, not nested under `meta` — normalizePagination
      // reads both shapes safely (see src/lib/pagination.js).
      setMeta(normalizePagination(res));
    } catch (err) {
      setError(err.message || 'Could not load programs.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, degreeLevel, intake, language, tuition, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);


  const handleReset = () => {
    setSearch('');
    setDegreeLevel('');
    setIntake('');
    setLanguage('');
    setTuition('');
    setPage(1);
  };

  const handleSave = async (e, programId) => {
    e.stopPropagation();
    try {
      await saveShortlist(programId);
      setSavedId(programId);
      setTimeout(() => setSavedId(null), 2500);
    } catch (err) {
      // silently ignore duplicate or error in list context
    }
  };

  return (
    <div className="programs-page flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: 'var(--color-charcoal)',
            }}
          >
            German Degree Programs
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Explore verified DAAD program data across German universities
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="search-bar" style={{ minWidth: 260 }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search programs or subjects..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <ViewToggle value={view} onChange={changeView} />
        </div>
      </div>

      {/* Active filter chips */}
      {(degreeLevel || intake || language || tuition) && (
        <div className="flex items-center gap-2 flex-wrap">
          {degreeLevel && (
            <span className="filter-chip">
              Degree: {formatDegreeLevel(degreeLevel)}
              <button type="button" onClick={() => { setDegreeLevel(''); setPage(1); }} aria-label="Remove degree filter">×</button>
            </span>
          )}
          {intake && (
            <span className="filter-chip">
              Intake: {formatIntake(intake)}
              <button type="button" onClick={() => { setIntake(''); setPage(1); }} aria-label="Remove intake filter">×</button>
            </span>
          )}
          {language && (
            <span className="filter-chip">
              Language: {formatLanguage(language)}
              <button type="button" onClick={() => { setLanguage(''); setPage(1); }} aria-label="Remove language filter">×</button>
            </span>
          )}
          {tuition && (
            <span className="filter-chip">
              Tuition: {tuition}
              <button type="button" onClick={() => { setTuition(''); setPage(1); }} aria-label="Remove tuition filter">×</button>
            </span>
          )}
        </div>
      )}

      {/* Sidebar filters + results */}
      <div className="programs-layout">
        <aside className="programs-filters">
          <h2 className="programs-filters-title">Filter Options</h2>

          <div className="programs-filter-group">
            <p className="programs-filter-label">Degree Level</p>
            {[
              { value: 'bachelor', label: 'Bachelor of Science (B.Sc.)' },
              { value: 'master', label: 'Master of Science (M.Sc.)' },
              { value: 'phd', label: 'PhD / Doctorate' },
            ].map((opt) => (
              <label key={opt.value} className="programs-filter-check">
                <input
                  type="checkbox"
                  checked={degreeLevel === opt.value}
                  onChange={() => { setDegreeLevel(degreeLevel === opt.value ? '' : opt.value); setPage(1); }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="programs-filter-group">
            <p className="programs-filter-label">Intake</p>
            {[
              { value: 'winter', label: 'Winter' },
              { value: 'summer', label: 'Summer' },
              { value: 'both', label: 'Both' },
            ].map((opt) => (
              <label key={opt.value} className="programs-filter-check">
                <input
                  type="checkbox"
                  checked={intake === opt.value}
                  onChange={() => { setIntake(intake === opt.value ? '' : opt.value); setPage(1); }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="programs-filter-group">
            <p className="programs-filter-label">Language</p>
            {[
              { value: 'english', label: 'English' },
              { value: 'german', label: 'German' },
              { value: 'mixed', label: 'Mixed' },
            ].map((opt) => (
              <label key={opt.value} className="programs-filter-check">
                <input
                  type="checkbox"
                  checked={language === opt.value}
                  onChange={() => { setLanguage(language === opt.value ? '' : opt.value); setPage(1); }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <div className="programs-filter-group">
            <p className="programs-filter-label">Tuition Fees</p>
            {[
              { value: 'free', label: 'No tuition fees (Free)' },
              { value: 'paid', label: 'Paid programs' },
              { value: 'both', label: 'Free & Paid' },
            ].map((opt) => (
              <label key={opt.value} className="programs-filter-check">
                <input
                  type="checkbox"
                  checked={tuition === opt.value}
                  onChange={() => { setTuition(tuition === opt.value ? '' : opt.value); setPage(1); }}
                />
                {opt.label}
              </label>
            ))}
          </div>

          {(degreeLevel || intake || language || tuition || search) && (
            <button type="button" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '0.5rem' }} onClick={handleReset}>
              Reset filters
            </button>
          )}
        </aside>

        <div className="programs-results">
      {error ? (
        <ErrorState title="Could not load programs" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid grid-3" style={{ gap: 'var(--space-4)' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-2xl)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No programs found"
          description="Try adjusting your search or clearing the filters to see more degree programs."
          action={<Button variant="secondary" onClick={handleReset}>Clear filters</Button>}
        />
      ) : view === 'grid' ? (
        <>
          <div className="programs-grid">
            {items.map((prog) => {
              const uni = prog.university || {};
              const uniName = uni.name || 'German University';
              const city = uni.city || '';
              return (
                <article
                  key={prog.id}
                  className="card card-hover premium-program-card"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.5rem 1.6rem',
                    borderRadius: '16px',
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
                  }}
                  onClick={() => navigate(`/student/programs/${prog.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/student/programs/${prog.id}`); }}
                  aria-label={`View ${prog.name}`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <p
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: 'var(--color-muted)',
                        }}
                      >
                        {uniName}
                      </p>
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.25rem',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        color: 'var(--color-charcoal)',
                        marginTop: '0.4rem',
                        lineHeight: 1.25,
                      }}
                    >
                      {prog.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={13} style={{ color: 'var(--color-gold)' }} />
                      {city || 'Germany'} · {formatDegreeLevel(prog.degree_level)}
                    </p>
                  </div>

                  <div
                    className="premium-program-grid"
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <span>Tuition</span>
                      <strong>{formatTuitionType(prog.tuition_type, prog.tuition_fee)}</strong>
                    </div>
                    <div>
                      <span>Language</span>
                      <strong>{formatLanguage(prog.language_of_instruction)}</strong>
                    </div>
                    <div>
                      <span>Intake</span>
                      <strong>{formatIntake(prog.intake)}</strong>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: '1.25rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/student/programs/${prog.id}`); }}
                    >
                      View Program <ExternalLink size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => handleSave(e, prog.id)}
                      disabled={savedId === prog.id}
                      aria-label={`Save ${prog.name} to shortlist`}
                    >
                      <Bookmark size={13} />
                      {savedId === prog.id ? 'Saved' : 'Save'}
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
            {items.map((prog) => {
              const uni = prog.university || {};
              const uniName = uni.name || 'German University';
              const city = uni.city || '';
              return (
                <article
                  key={prog.id}
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
                  onClick={() => navigate(`/student/programs/${prog.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/student/programs/${prog.id}`); }}
                  aria-label={`View ${prog.name}`}
                >
                  <div style={{ flex: '1 1 240px', minWidth: 0 }}>
                    <p className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-1">
                      <MapPin size={12} /> {uniName}{city ? ` · ${city}` : ''}
                    </p>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        color: 'var(--color-charcoal)',
                        marginTop: '0.2rem',
                      }}
                    >
                      {prog.name}
                    </h3>
                    <p className="text-sm text-muted mt-1">
{formatDegreeLevel(prog.degree_level)} · {formatTuitionType(prog.tuition_type, prog.tuition_fee)} · {formatLanguage(prog.language_of_instruction)} · {formatIntake(prog.intake)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={(e) => { e.stopPropagation(); navigate(`/student/programs/${prog.id}`); }}
                    >
                      View Program <ExternalLink size={13} />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={(e) => handleSave(e, prog.id)}
                      disabled={savedId === prog.id}
                      aria-label={`Save ${prog.name} to shortlist`}
                    >
                      <Bookmark size={13} />
                      {savedId === prog.id ? 'Saved' : 'Save'}
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
      )}
        </div>
      </div>
    </div>
  );
}