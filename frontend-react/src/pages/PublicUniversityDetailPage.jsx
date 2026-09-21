import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Globe2,
  Landmark,
  GraduationCap,
  Bookmark,
} from 'lucide-react';
import { api } from '../api/client';
import { ErrorState, EmptyState } from '../components/ui';
import { Navbar } from '../components/landing/Navbar';
import { SiteFooter } from '../components/landing/SiteFooter';
import {
  formatDegreeLevel,
  formatLanguage,
  formatIntake,
  formatTuitionType,
} from '../lib/format';

export default function PublicUniversityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    if (!id || !/^\d+$/.test(id)) {
      setError('Invalid university link. Please return to the universities list.');
      setLoading(false);
      return () => { active = false; };
    }
    
    // Fetch from public API
    api(`/universities/${id}`)
      .then(async (res) => {
        const loadedUniversity = res?.university || res?.data?.university || res?.data || res || null;
        if (!loadedUniversity) return;

        // The detail endpoint normally includes programs. Keep a paginated
        // fallback so every catalogue program is still shown if that relation
        // is omitted by an older API response.
        if (!Array.isArray(loadedUniversity.programs) || loadedUniversity.programs.length === 0) {
          try {
            const programsResponse = await api(`/programs?university_id=${id}&per_page=100`);
            const programs = Array.isArray(programsResponse?.data?.data)
              ? programsResponse.data.data
              : (Array.isArray(programsResponse?.data) ? programsResponse.data : []);
            loadedUniversity.programs = programs;
            loadedUniversity.program_count = loadedUniversity.program_count || programs.length;
          } catch {
            loadedUniversity.programs = Array.isArray(loadedUniversity.programs) ? loadedUniversity.programs : [];
          }
        }

        if (active) setUniversity(loadedUniversity);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load university.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
      
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <div className="skeleton" style={{ height: 220, borderRadius: '16px', marginBottom: '2rem' }} />
          <div className="skeleton" style={{ height: 320, borderRadius: '16px' }} />
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (error || !university) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <ErrorState title={error ? "Could not load university" : "University not found"} description={error || "The requested institution could not be located."} onRetry={() => navigate('/universities')} />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const programs = Array.isArray(university.programs) ? university.programs : [];

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '2rem 1.5rem 5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/universities')} style={{ marginBottom: '1.5rem', color: '#64748B' }}>
          <ArrowLeft size={15} /> Back to universities
        </button>

        {/* Hero */}
        <div className="public-university-hero" style={{ borderRadius: '24px', overflow: 'hidden', background: '#0F172A', position: 'relative', padding: '4rem 3rem', marginBottom: '3rem' }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', marginBottom: '1rem' }}>
              <Landmark size={14} color="#C49746" /> {university.country || 'Germany'}
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#FFFFFF', margin: 0, lineHeight: 1.15 }}>
              {university.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', color: '#CBD5E1', fontSize: '0.9rem' }}>
              {university.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} color="#C49746" /> {university.city}{university.state ? `, ${university.state}` : ''}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GraduationCap size={16} color="#C49746" /> {university.program_count ?? programs.length} Programs</span>
            </div>
          </div>
        </div>

        <div className="public-university-content" style={{ display: 'grid', gap: '2.5rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {university.description && (
              <section>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0' }}>
                  <Globe2 size={24} color="#C49746" /> About the University
                </h2>
                <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <p style={{ color: '#4A5568', fontSize: '1rem', lineHeight: 1.8, margin: 0 }}>
                    {university.description}
                  </p>
                </div>
              </section>
            )}

            <section>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0' }}>
                <GraduationCap size={24} color="#C49746" /> Degree Programs
              </h2>
              
              {programs.length === 0 ? (
                <EmptyState icon={GraduationCap} title="No programs listed" description="This university currently has no programs in the catalogue." />
              ) : (
                <div className="public-university-programs" style={{ display: 'grid', gap: '1.5rem' }}>
                  {programs.map((prog) => (
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
                          {formatDegreeLevel(prog.degree_level)}
                        </p>
                        <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.15rem', fontWeight: 600, color: '#0F172A', margin: '0.5rem 0', lineHeight: 1.25 }}>
                          {prog.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {formatLanguage(prog.language_of_instruction)} · {formatIntake(prog.intake)}
                        </p>
                      </div>

                      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>{formatTuitionType(prog.tuition_type)}</span>
                        <span style={{ color: '#C49746', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          View <ExternalLink size={14} />
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', margin: '0 0 1.5rem 0' }}>University Facts</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.25rem 0' }}><MapPin size={14} /> Location</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{university.city || 'Germany'}{university.state ? `, ${university.state}` : ''}</p>
                </div>
                {university.tuition_type && (
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0', display: 'block' }}>Tuition System</span>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{formatTuitionType(university.tuition_type)}</p>
                  </div>
                )}
                {university.ranking && (
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0', display: 'block' }}>Ranking</span>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>Top {university.ranking}</p>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {university.website_url && (
                  <a href={university.website_url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#F1F5F9', color: '#0F172A', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                    Visit Website <ExternalLink size={16} />
                  </a>
                )}
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#0F172A', color: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                  Sign In to Save <Bookmark size={16} />
                </Link>
              </div>
            </div>
          </aside>

        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
