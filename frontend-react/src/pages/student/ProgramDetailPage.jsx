import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bookmark,
  CheckCircle2,
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
import { fetchProgramDetail, saveShortlist } from '../../api/student';
import { ErrorState, Button } from '../../components/ui';
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
} from '../../lib/format';

/**
 * Program Detail — real GET /v1/programs/{id}.
 * Sticky actions: Save to Shortlist (real) + Apply (external link when available).
 */
export default function ProgramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchProgramDetail(id)
      .then((res) => {
        if (active) setProgram(res?.program || null);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load program.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  const handleSave = async () => {
    try {
      await saveShortlist(program.id);
      setSaved(true);
      setSaveMessage('Program added to your shortlist.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(err.message || 'Could not save to shortlist.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton" style={{ height: 220, borderRadius: 'var(--radius-2xl)' }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 'var(--radius-2xl)' }} />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Could not load program" description={error} onRetry={() => window.location.reload()} />;
  }

  if (!program) {
    return <ErrorState title="Program not found" description="The requested program could not be located." onRetry={() => navigate('/student/programs')} />;
  }

  const uni = program.university || {};
  // Real, distinct destinations — never conflated.
  const universityUrl = safeUrl(uni.website_url);
  const daadUrl = safeUrl(program.daad_program_link);
  const applicationUrl = safeUrl(program.application_link);

  // Only show a separate "University Website" action when it differs from the
  // application portal. When they are identical, the unique destination is the
  // application portal, so we never duplicate the same URL under two labels.
  const universityWebsiteDiffers =
    universityUrl && applicationUrl && universityUrl !== applicationUrl;

  const programDescription = formatText(program.description);
  const uniDescription = formatText(uni.description);

  return (
    <div className="program-detail flex flex-col gap-6">
      {/* Back link */}
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/student/programs')} style={{ alignSelf: 'flex-start' }}>
        <ArrowLeft size={15} /> All programs
      </button>

      {/* Hero */}
      <div
        className="card"
        style={{
          borderRadius: 'var(--radius-2xl)',
          overflow: 'hidden',
          border: 'none',
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div className="program-detail-hero-content">
          <img
            src="/figma_assets/program-details___hero-banner.png"
            alt=""
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 0,
            }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(14, 27, 46, 0.72)', zIndex: 0 }} />
          <div className="flex items-start justify-between gap-6 flex-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 720 }}>
              <span
                className="badge"
                style={{
                  background: 'var(--color-gold)',
                  color: '#0e1b2e',
                  fontWeight: 700,
                  marginBottom: '0.85rem',
                  display: 'inline-flex',
                }}
              >
                95% Profile Match
              </span>
              <p className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1" style={{ color: 'rgba(247,245,239,0.75)' }}>
                <Landmark size={13} /> {uni.name || 'German University'}
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
                  fontWeight: 400,
                  letterSpacing: '-0.03em',
                  color: 'var(--color-ivory)',
                  marginTop: '0.6rem',
                  lineHeight: 1.1,
                }}
              >
                {program.name}
              </h1>
              <p className="flex items-center gap-3 mt-3 text-sm flex-wrap" style={{ color: 'rgba(247,245,239,0.75)' }}>
                <span className="flex items-center gap-1"><GraduationCap size={14} /> {formatDegreeLevel(program.degree_level)}</span>
                {uni.city && <span className="flex items-center gap-1"><MapPin size={14} /> {uni.city}{uni.state ? `, ${uni.state}` : ''}</span>}
                <span className="flex items-center gap-1"><Globe2 size={14} /> {formatLanguage(program.language_of_instruction)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="program-detail-tabs">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'requirements', label: 'Requirements' },
            { id: 'university', label: 'University' },
            { id: 'application', label: 'Application & Deadlines' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`program-detail-tab ${activeTab === tab.id ? 'program-detail-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Sticky action bar */}
        <div className="program-detail-sticky-bar">
          <div className="flex items-center gap-3 flex-wrap">
            {program.deadline_winter && (
              <span className="badge badge-neutral"><Calendar size={12} /> Winter: {formatDate(program.deadline_winter)}</span>
            )}
            {program.deadline_summer && (
              <span className="badge badge-neutral"><Calendar size={12} /> Summer: {formatDate(program.deadline_summer)}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleSave} disabled={saved}>
              <Bookmark size={15} /> {saved ? 'Saved to Shortlist' : 'Save to Shortlist'}
            </Button>
            {applicationUrl ? (
              <a
                href={applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-full)' }}
              >
                Apply <ExternalLink size={15} />
              </a>
            ) : (
              <Button variant="primary" disabled>
                Apply <ExternalLink size={15} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {saveMessage && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-success-50)',
            border: '1px solid rgba(34,197,94,0.3)',
            color: '#15803d',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} /> {saveMessage}
        </div>
      )}

      {/* Body grid */}
      <div className="program-detail-grid">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          {/* Overview */}
          {activeTab === 'overview' && (
          <section className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem 2rem' }}>
            <h2 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
              <BookOpen size={18} style={{ color: 'var(--color-forest)' }} /> Overview
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
              {programDescription !== 'Not Specified'
                ? programDescription
                : 'Program details were not provided by the source dataset.'}
            </p>
          </section>
          )}

          {/* Requirements & Eligibility */}
          {activeTab === 'requirements' && (
          <section className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem 2rem' }}>
            <h2 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
              <FileText size={18} style={{ color: 'var(--color-forest)' }} /> Requirements & Eligibility
            </h2>
            <div className="grid grid-2" style={{ gap: '1.25rem', marginTop: '1rem' }}>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-semibold">English</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
                  {formatEnglishRequirement(program.english_requirements)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-semibold">German</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
                  {formatGermanRequirement(program.german_requirements)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-semibold">Admission</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
                  {formatAdmissionMethod(program.admission_method)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-semibold">Eligibility</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
                  {formatEligibility(program.eligibility_rules)}
                </p>
              </div>
            </div>
          </section>
          )}

          {/* University info */}
          {activeTab === 'university' && (
          <section className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem 2rem' }}>
            <h2 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
              <Building2 size={18} style={{ color: 'var(--color-forest)' }} /> University Information
            </h2>
            <div className="mt-3">
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>{uni.name}</h3>
              <p className="text-sm text-muted mt-1">
                {uni.city}{uni.state ? `, ${uni.state}` : ''}{uni.country ? `, ${uni.country}` : ''}
              </p>
{uniDescription !== 'Not Specified' && (
                <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
                  {uniDescription}
                </p>
              )}
              {/* Distinct external destinations — never conflated.
                  University Website only shows when it differs from the
                  application portal, so we never duplicate the same URL. */}
              <div className="flex items-center gap-3 flex-wrap mt-4">
                {universityUrl && universityWebsiteDiffers && (
                  <a
                    href={universityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'inline-flex' }}
                  >
                    Visit University Website <ExternalLink size={13} />
                  </a>
                )}
                {daadUrl && (
                  <a
                    href={daadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ display: 'inline-flex' }}
                  >
                    View on DAAD <ExternalLink size={13} />
                  </a>
                )}
              </div>
            </div>
          </section>
          )}

          {/* Application */}
          {activeTab === 'application' && (
          <section className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem 2rem' }}>
            <h2 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
              <FileText size={18} style={{ color: 'var(--color-forest)' }} /> Application
            </h2>
            <div className="mt-3 grid grid-2" style={{ gap: '1.25rem' }}>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted font-semibold">Admission Method</p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
                  {formatAdmissionMethod(program.admission_method)}
                </p>
              </div>
            </div>
            {applicationUrl ? (
              <a
                href={applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm mt-4"
                style={{ borderRadius: 'var(--radius-full)', display: 'inline-flex' }}
              >
                Apply <ExternalLink size={14} />
              </a>
            ) : (
              <p className="text-sm text-muted mt-4">
                No application link available for this program.
              </p>
            )}
          </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.5rem', position: 'sticky', top: 'var(--topbar-height)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '1rem' }}>Program Key Facts</h3>
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs uppercase tracking-wide text-muted font-semibold flex items-center gap-1"><GraduationCap size={12} /> Degree</span>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-charcoal)' }}>{formatDegreeLevel(program.degree_level)}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-muted font-semibold flex items-center gap-1"><Euro size={12} /> Tuition</span>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-charcoal)' }}>
{formatTuitionType(program.tuition_type, program.tuition_fee)}
                {program.tuition_fee && program.tuition_fee > 0 ? ` · €${program.tuition_fee}` : ''}
              </p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-muted font-semibold flex items-center gap-1"><Globe2 size={12} /> Language</span>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-charcoal)' }}>{formatLanguage(program.language_of_instruction)}</p>
            </div>
            <div>
              <span className="text-xs uppercase tracking-wide text-muted font-semibold flex items-center gap-1"><Calendar size={12} /> Intake</span>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-charcoal)' }}>{formatIntake(program.intake)}</p>
            </div>
            {program.deadline_winter && (
              <div>
                <span className="text-xs uppercase tracking-wide text-muted font-semibold">Winter Deadline</span>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-charcoal)' }}>{formatDate(program.deadline_winter)}</p>
              </div>
            )}
            {program.deadline_summer && (
              <div>
                <span className="text-xs uppercase tracking-wide text-muted font-semibold">Summer Deadline</span>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-charcoal)' }}>{formatDate(program.deadline_summer)}</p>
              </div>
            )}
            {program.subject_category && (
              <div>
                <span className="text-xs uppercase tracking-wide text-muted font-semibold">Field</span>
                <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-charcoal)' }}>{formatDisplayValue(program.subject_category)}</p>
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-sm"
            style={{
              width: '100%',
              marginTop: '1.5rem',
              background: 'var(--color-gold)',
              color: '#0e1b2e',
              border: 'none',
              fontWeight: 700,
              padding: '0.7rem',
            }}
            onClick={handleSave}
            disabled={saved}
          >
            <Bookmark size={15} /> {saved ? 'Saved to Shortlist' : 'Add to Shortlist'}
          </button>
        </aside>
      </div>
    </div>
  );
}
