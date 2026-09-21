import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  ExternalLink,
  GraduationCap,
  MapPin,
  Globe2,
  Calendar,
  BookOpen,
  Landmark,
  Building2,
  Euro,
  FileText,
} from 'lucide-react';
import { api } from '../api/client';
import { ErrorState } from '../components/ui';
import {
  formatDegreeLevel,
  formatLanguage,
  formatIntake,
  formatTuitionType,
  formatAdmissionMethod,
  formatDate,
  formatEnglishRequirement,
  formatGermanRequirement,
  formatEligibility,
  formatText,
  formatDisplayValue,
  safeUrl,
} from '../lib/format';
import { Navbar } from '../components/landing/Navbar';
import { SiteFooter } from '../components/landing/SiteFooter';

export default function PublicProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    
    // Fetch from public API
    api(`/programs/${id}`)
      .then((res) => {
        if (active) setProgram(res?.program || res?.data?.program || res?.data || res || null);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load program.');
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

  if (error || !program) {
    return (
      <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: '3rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
          <ErrorState title={error ? "Could not load program" : "Program not found"} description={error || "The requested program could not be located."} onRetry={() => navigate('/programs')} />
        </main>
        <SiteFooter />
      </div>
    );
  }

  const uni = program.university || {};
  const universityUrl = safeUrl(uni.website_url);
  const daadUrl = safeUrl(program.daad_program_link);
  const applicationUrl = safeUrl(program.application_link);
  const universityWebsiteDiffers = universityUrl && applicationUrl && universityUrl !== applicationUrl;

  const programDescription = formatText(program.description);
  const uniDescription = formatText(uni.description);
  const universityId = uni.id || program.university_id;

  return (
    <div style={{ background: '#FAF7F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, padding: '2rem 1.5rem 5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/programs')} style={{ marginBottom: '1.5rem', color: '#64748B' }}>
          <ArrowLeft size={15} /> Back to programs
        </button>

        {/* Hero */}
        <div className="public-program-detail-hero" style={{ borderRadius: '24px', overflow: 'hidden', background: '#0F172A', position: 'relative' }}>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
            <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8', marginBottom: '1rem' }}>
              <Landmark size={14} color="#C49746" /> {uni.name || 'German University'}
            </p>
            <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: '#FFFFFF', margin: 0, lineHeight: 1.15 }}>
              {program.name}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem', flexWrap: 'wrap', color: '#CBD5E1', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><GraduationCap size={16} color="#C49746" /> {formatDegreeLevel(program.degree_level)}</span>
              {uni.city && <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16} color="#C49746" /> {uni.city}{uni.state ? `, ${uni.state}` : ''}</span>}
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Globe2 size={16} color="#C49746" /> {formatLanguage(program.language_of_instruction)}</span>
            </div>
          </div>
        </div>

        {/* Sticky action bar / Tabs wrapper */}
        <div className="program-detail-sticky-bar" style={{ borderBottom: '1px solid #E2E8F0', marginBottom: '2rem' }}>
          <div className="program-detail-tabs">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'requirements', label: 'Requirements' },
              { id: 'university', label: 'University' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`program-detail-tab ${activeTab === tab.id ? 'program-detail-tab-active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="program-detail-actions">
            <Link to="/login" className="program-detail-save-link">
              <Bookmark size={15} /> Save to Shortlist
            </Link>
          </div>
        </div>

        <div className="program-detail-grid">
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {activeTab === 'overview' && (
              <section style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0' }}>
                  <BookOpen size={20} color="#C49746" /> Overview
                </h2>
                <p style={{ color: '#4A5568', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
                  {programDescription !== 'Not Specified' ? programDescription : 'Program details were not provided by the source dataset.'}
                </p>
                <div className="program-detail-overview-application">
                  <p className="program-detail-overview-label">Application Information</p>
                  <p style={{ color: '#0F172A', fontSize: '0.95rem', margin: '0 0 1rem' }}>
                    {formatAdmissionMethod(program.admission_method)}
                  </p>
                  {applicationUrl ? (
                    <a href={applicationUrl} target="_blank" rel="noopener noreferrer" className="program-detail-apply-link">
                      Apply on University Portal <ExternalLink size={16} />
                    </a>
                  ) : (
                    <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
                      No direct application link available for this program.
                    </p>
                  )}
                </div>
              </section>
            )}

            {activeTab === 'requirements' && (
              <section style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0' }}>
                  <FileText size={20} color="#C49746" /> Requirements & Eligibility
                </h2>
                <div className="program-detail-requirements-grid">
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0' }}>English</p>
                    <p style={{ color: '#0F172A', fontSize: '0.95rem', margin: 0 }}>{formatEnglishRequirement(program.english_requirements)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0' }}>German</p>
                    <p style={{ color: '#0F172A', fontSize: '0.95rem', margin: 0 }}>{formatGermanRequirement(program.german_requirements)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0' }}>Admission</p>
                    <p style={{ color: '#0F172A', fontSize: '0.95rem', margin: 0 }}>{formatAdmissionMethod(program.admission_method)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0' }}>Eligibility</p>
                    <p style={{ color: '#0F172A', fontSize: '0.95rem', margin: 0 }}>{formatEligibility(program.eligibility_rules)}</p>
                  </div>
                </div>
              </section>
            )}

            {activeTab === 'university' && (
              <section style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1rem 0' }}>
                  <Building2 size={20} color="#C49746" /> University Information
                </h2>
                <div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{uni.name}</h3>
                  <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0.25rem 0 1rem 0' }}>{uni.city}{uni.state ? `, ${uni.state}` : ''}{uni.country ? `, ${uni.country}` : ''}</p>
                  {uniDescription !== 'Not Specified' && (
                    <p style={{ color: '#4A5568', fontSize: '0.95rem', lineHeight: 1.7, margin: '0 0 1.5rem 0' }}>
                      {uniDescription}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {universityUrl && universityWebsiteDiffers && (
                      <a href={universityUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', background: '#F1F5F9', color: '#0F172A', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        Visit University Website <ExternalLink size={14} />
                      </a>
                    )}
                    {universityId && (
                      <Link to={`/universities/${universityId}`} style={{ padding: '0.5rem 1rem', background: '#0F172A', color: '#FFFFFF', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        View University Profile <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            )}

          </div>

          <aside className="program-detail-facts" style={{ background: '#FFFFFF', padding: '2rem', borderRadius: '16px', border: '1px solid #E2E8F0', height: 'fit-content' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', fontWeight: 600, color: '#0F172A', margin: '0 0 1.5rem 0' }}>Program Key Facts</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.25rem 0' }}><GraduationCap size={14} /> Degree</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{formatDegreeLevel(program.degree_level)}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.25rem 0' }}><Euro size={14} /> Tuition</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{formatTuitionType(program.tuition_type, program.tuition_fee)}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.25rem 0' }}><Globe2 size={14} /> Language</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{formatLanguage(program.language_of_instruction)}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', margin: '0 0 0.25rem 0' }}><Calendar size={14} /> Intake</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{formatIntake(program.intake)}</p>
              </div>
              {program.deadline_winter && (
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0', display: 'block' }}>Winter Deadline</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{formatDate(program.deadline_winter)}</p>
                </div>
              )}
              {program.deadline_summer && (
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#64748B', fontWeight: 600, margin: '0 0 0.25rem 0', display: 'block' }}>Summer Deadline</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0F172A', margin: 0 }}>{formatDate(program.deadline_summer)}</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 1rem 0' }}>Ready to apply or need help?</p>
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#0F172A', color: '#FFFFFF', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>
                Sign In to Save <Bookmark size={16} />
              </Link>
            </div>
          </aside>

        </div>
      </main>
      
      <SiteFooter />
    </div>
  );
}
