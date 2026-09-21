import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, GraduationCap, ExternalLink, MapPin } from 'lucide-react';
import { api } from '../api/client';
import { Pagination, EmptyState, ErrorState, Button } from '../components/ui';
import { ViewToggle } from '../components/shared/ViewToggle';
import { formatDegreeLevel, formatLanguage, formatTuitionType, formatIntake } from '../lib/format';
import { useDebounce } from '../hooks/useDebounce';
import { normalizePagination } from '../lib/pagination';
import { Navbar } from '../components/landing/Navbar';
import { SiteFooter } from '../components/landing/SiteFooter';
import { SUBJECT_CATEGORIES } from '../constants/options';

const PAGE_SIZE = 12;
const VIEW_KEY = 'studypath_public_programs_view';

export default function PublicProgramsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null) setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const title = 'Study in Germany: Find German University Programs | Orbon Consultancy';
    const description = 'Explore verified German university programs for international students. Find English-taught, tuition-free, Bachelor\'s, Master\'s and PhD programs in Germany.';
    document.title = title;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.name = 'description';
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.content = description;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/programs`;

    const structuredData = document.createElement('script');
    structuredData.type = 'application/ld+json';
    structuredData.dataset.page = 'programs';
    structuredData.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: `${window.location.origin}/programs`,
      about: {
        '@type': 'Thing',
        name: 'German university degree programs for international students',
      },
    });
    document.head.appendChild(structuredData);

    return () => structuredData.remove();
  }, []);

  const [degreeLevel, setDegreeLevel] = useState(searchParams.get('degree') || '');
  const [intake, setIntake] = useState('');
  const [language, setLanguage] = useState(searchParams.get('language') ? 'english' : '');
  const [tuition, setTuition] = useState(searchParams.get('tuition') === '0' ? 'free' : '');
  const [subjects, setSubjects] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState(() => new Set());

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
        ...(degreeLevel ? { degree_level: degreeLevel } : {}),
        ...(intake ? { intake } : {}),
        ...(language ? { language_of_instruction: language } : {}),
        ...(tuition ? { tuition_type: tuition } : {}),
      };
      // Use public api endpoint
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => qs.set(k, v));
      subjects.forEach((subject) => qs.append('subject_category[]', subject));
      const res = await api(`/programs?${qs.toString()}`);
      const data = Array.isArray(res?.data?.data) ? res.data.data : (Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []));
      setItems(data);
      setMeta(normalizePagination(res));
    } catch (err) {
      setError(err.message || 'Could not load programs.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, degreeLevel, intake, language, tuition, subjects, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, degreeLevel, intake, language, tuition]);

  useEffect(() => {
    load();
  }, [load]);

  const handleReset = () => {
    setSearch('');
    setDegreeLevel('');
    setIntake('');
    setLanguage('');
    setTuition('');
    setSubjects([]);
    setPage(1);
  };

  const toggleSubject = (value) => {
    setSubjects((current) => current.includes(value)
      ? current.filter((subject) => subject !== value)
      : [...current, value]);
    setPage(1);
  };

  const toggleCategory = (categoryName) => {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(categoryName)) next.delete(categoryName);
      else next.add(categoryName);
      return next;
    });
  };

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <div className="programs-page flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 600, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                Find Your Perfect Program
              </h1>
              <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
                Search verified German university programs for international students. Compare English-taught degrees, tuition-free study options, intakes, and degree levels in Germany.
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
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <ViewToggle value={view} onChange={changeView} />
            </div>
          </div>

          {(degreeLevel || intake || language || tuition || subjects.length > 0) && (
            <div className="flex items-center gap-2 flex-wrap">
              {degreeLevel && (
                <span className="filter-chip">
                  Degree: {formatDegreeLevel(degreeLevel)}
                  <button type="button" onClick={() => setDegreeLevel('')}>×</button>
                </span>
              )}
              {intake && (
                <span className="filter-chip">
                  Intake: {formatIntake(intake)}
                  <button type="button" onClick={() => setIntake('')}>×</button>
                </span>
              )}
              {language && (
                <span className="filter-chip">
                  Language: {formatLanguage(language)}
                  <button type="button" onClick={() => setLanguage('')}>×</button>
                </span>
              )}
              {tuition && (
                <span className="filter-chip">
                  Tuition: {tuition}
                  <button type="button" onClick={() => setTuition('')}>×</button>
                </span>
              )}
              {subjects.length > 0 && (
                <span className="filter-chip">
                  Subjects: {subjects.length} selected
                  <button type="button" onClick={() => { setSubjects([]); setPage(1); }}>×</button>
                </span>
              )}
            </div>
          )}

          <div className="programs-layout">
            <aside className="programs-filters" style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0', height: 'fit-content' }}>
              <h2 className="programs-filters-title" style={{ color: '#0F172A' }}>Filter Programs</h2>

              <div className="programs-filter-group">
                <p className="programs-filter-label" style={{ color: '#64748B' }}>Degree Level</p>
                {[
                  { value: 'bachelor', label: 'Bachelor of Science (B.Sc.)' },
                  { value: 'master', label: 'Master of Science (M.Sc.)' },
                  { value: 'phd', label: 'PhD / Doctorate' },
                ].map((opt) => (
                  <label key={opt.value} className="programs-filter-check" style={{ color: '#0F172A' }}>
                    <input type="checkbox" checked={degreeLevel === opt.value} onChange={() => setDegreeLevel(degreeLevel === opt.value ? '' : opt.value)} />
                    {opt.label}
                  </label>
                ))}
              </div>

              <div className="programs-filter-group">
                <p className="programs-filter-label">Academic Field</p>
                {SUBJECT_CATEGORIES.map((category) => {
                  const isExpanded = expandedCategories.has(category.category);
                  return (
                    <div key={category.category} className="programs-subject-group">
                      <button
                        type="button"
                        className="programs-filter-parent"
                        aria-expanded={isExpanded}
                        onClick={() => toggleCategory(category.category)}
                      >
                        <strong>{category.category}</strong>
                        <span aria-hidden="true">{isExpanded ? '−' : '+'}</span>
                      </button>
                      {isExpanded && (
                        <div className="programs-subject-children">
                          {category.subcategories.map((subject) => (
                            <label key={subject.value} className="programs-filter-check">
                              <input
                                type="checkbox"
                                checked={subjects.includes(subject.value)}
                                onChange={() => toggleSubject(subject.value)}
                              />
                              {subject.label}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="programs-filter-group">
                <p className="programs-filter-label" style={{ color: '#64748B' }}>Intake</p>
                {[
                  { value: 'winter', label: 'Winter' },
                  { value: 'summer', label: 'Summer' },
                  { value: 'both', label: 'Both' },
                ].map((opt) => (
                  <label key={opt.value} className="programs-filter-check" style={{ color: '#0F172A' }}>
                    <input type="checkbox" checked={intake === opt.value} onChange={() => setIntake(intake === opt.value ? '' : opt.value)} />
                    {opt.label}
                  </label>
                ))}
              </div>

              <div className="programs-filter-group">
                <p className="programs-filter-label" style={{ color: '#64748B' }}>Language</p>
                {[
                  { value: 'english', label: 'English' },
                  { value: 'german', label: 'German' },
                  { value: 'mixed', label: 'Mixed' },
                ].map((opt) => (
                  <label key={opt.value} className="programs-filter-check" style={{ color: '#0F172A' }}>
                    <input type="checkbox" checked={language === opt.value} onChange={() => setLanguage(language === opt.value ? '' : opt.value)} />
                    {opt.label}
                  </label>
                ))}
              </div>

              <div className="programs-filter-group">
                <p className="programs-filter-label" style={{ color: '#64748B' }}>Tuition Fees</p>
                {[
                  { value: 'free', label: 'No tuition fees (Free)' },
                  { value: 'paid', label: 'Paid programs' },
                  { value: 'both', label: 'Free & Paid' },
                ].map((opt) => (
                  <label key={opt.value} className="programs-filter-check" style={{ color: '#0F172A' }}>
                    <input type="checkbox" checked={tuition === opt.value} onChange={() => setTuition(tuition === opt.value ? '' : opt.value)} />
                    {opt.label}
                  </label>
                ))}
              </div>

              {(degreeLevel || intake || language || tuition || subjects.length > 0 || search) && (
                <button type="button" className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: '1rem', color: '#0F172A', border: '1px solid #E2E8F0' }} onClick={handleReset}>
                  Reset filters
                </button>
              )}
            </aside>

            <div className="programs-results">
              {error ? (
                <ErrorState title="Could not load programs" description={error} onRetry={load} />
              ) : loading ? (
                <div className="grid grid-3" style={{ gap: '1.5rem' }}>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 180, borderRadius: '16px' }} />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <EmptyState icon={GraduationCap} title="No programs found" description="Try adjusting your search or clearing the filters to see more degree programs." action={<Button variant="secondary" onClick={handleReset}>Clear filters</Button>} />
              ) : view === 'grid' ? (
                <>
                  <div className="programs-grid" style={{ gap: '1.5rem' }}>
                    {items.map((prog) => {
                      const uni = prog.university || {};
                      const uniName = uni.name || 'German University';
                      const city = uni.city || '';
                      return (
                        <article
                          key={prog.id}
                          style={{
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            background: '#FFFFFF',
                            border: '1px solid #E2E8F0',
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
                          onClick={() => navigate(`/programs/${prog.id}`)}
                        >
                          <div>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B' }}>
                              {uniName}
                            </p>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', marginTop: '0.4rem', lineHeight: 1.25 }}>
                              {prog.name}
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <MapPin size={13} style={{ color: '#C49746' }} />
                              {city || 'Germany'} · {formatDegreeLevel(prog.degree_level)}
                            </p>
                          </div>

                          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.8rem' }}>
                            <div><span style={{ color: '#64748B', display: 'block' }}>Tuition</span><strong style={{ color: '#0F172A' }}>{formatTuitionType(prog.tuition_type, prog.tuition_fee)}</strong></div>
                            <div><span style={{ color: '#64748B', display: 'block' }}>Language</span><strong style={{ color: '#0F172A' }}>{formatLanguage(prog.language_of_instruction)}</strong></div>
                            <div><span style={{ color: '#64748B', display: 'block' }}>Intake</span><strong style={{ color: '#0F172A' }}>{formatIntake(prog.intake)}</strong></div>
                          </div>

                          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
                            <span style={{ color: '#C49746', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              View Program Details <ExternalLink size={14} />
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
              ) : (
                <>
                  <div className="flex flex-col" style={{ gap: '1rem' }}>
                    {items.map((prog) => {
                      const uni = prog.university || {};
                      const uniName = uni.name || 'German University';
                      const city = uni.city || '';
                      return (
                        <article
                          key={prog.id}
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
                          onClick={() => navigate(`/programs/${prog.id}`)}
                        >
                          <div style={{ flex: '1 1 240px' }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <MapPin size={12} color="#C49746" /> {uniName}{city ? ` · ${city}` : ''}
                            </p>
                            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem', fontWeight: 600, color: '#0F172A', marginTop: '0.25rem' }}>
                              {prog.name}
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
                              {formatDegreeLevel(prog.degree_level)} · {formatTuitionType(prog.tuition_type, prog.tuition_fee)} · {formatLanguage(prog.language_of_instruction)}
                            </p>
                          </div>
                          <div>
                            <span style={{ color: '#C49746', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem', border: '1px solid #C49746', borderRadius: '6px' }}>
                              View <ExternalLink size={14} />
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
          </div>
        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
