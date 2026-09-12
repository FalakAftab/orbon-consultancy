import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  ExternalLink,
  Globe2,
  Landmark,
  GraduationCap,
  Bookmark,
} from 'lucide-react';
import { fetchUniversityDetail, saveFavorite } from '../../api/student';
import { ErrorState, Button, EmptyState } from '../../components/ui';
import { MatchRing } from '../../components/shared/PremiumVisuals';
import {
  formatDegreeLevel,
  formatLanguage,
  formatIntake,
  formatTuitionType,
} from '../../lib/format';

/**
 * University Detail — real GET /v1/universities/{id}.
 * Shows university info + its programs.
 */
export default function UniversityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    fetchUniversityDetail(id)
      .then((res) => {
        if (active) setUniversity(res?.university || null);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load university.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [id]);

  const handleSave = async () => {
    try {
      await saveFavorite(university.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      // ignore duplicates
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="skeleton" style={{ height: 200, borderRadius: 'var(--radius-2xl)' }} />
        <div className="skeleton" style={{ height: 300, borderRadius: 'var(--radius-2xl)' }} />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Could not load university" description={error} onRetry={() => window.location.reload()} />;
  }

  if (!university) {
    return <ErrorState title="University not found" description="The requested institution could not be located." onRetry={() => navigate('/student/universities')} />;
  }

  const programs = Array.isArray(university.programs) ? university.programs : [];

  return (
    <div className="university-detail flex flex-col gap-6">
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/student/universities')} style={{ alignSelf: 'flex-start' }}>
        <ArrowLeft size={15} /> All universities
      </button>

      {/* Hero */}
      <div className="card" style={{ borderRadius: 'var(--radius-2xl)', overflow: 'hidden', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
        <div
          style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(11,59,54,0.06), rgba(23,59,87,0.08)), var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted font-semibold flex items-center gap-1">
                <Landmark size={13} /> {university.country || 'Germany'}
              </p>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.8rem, 4vw, 2.75rem)',
                  fontWeight: 600,
                  letterSpacing: 'var(--letter-spacing-tight)',
                  color: 'var(--color-charcoal)',
                  marginTop: '0.6rem',
                  lineHeight: 1.15,
                }}
              >
                {university.name}
              </h1>
              <p className="flex items-center gap-3 mt-3 text-muted text-sm flex-wrap">
                {university.city && <span className="flex items-center gap-1"><MapPin size={14} /> {university.city}{university.state ? `, ${university.state}` : ''}</span>}
                {university.ranking && <span className="flex items-center gap-1"><GraduationCap size={14} /> Rank {university.ranking}</span>}
                {university.program_count != null && <span>{university.program_count} programs</span>}
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <MatchRing value={university.ranking ? Math.max(60, 100 - university.ranking) : 88} tone="gold" />
              <span className="text-xs text-muted">Rank</span>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '1rem 2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div className="flex items-center gap-3 flex-wrap">
            {university.tuition_type && <span className="badge badge-neutral">{formatTuitionType(university.tuition_type)} tuition</span>}
            {university.scholarship_available && <span className="badge badge-gold">Scholarships</span>}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={handleSave} disabled={saved}>
              <Bookmark size={15} /> {saved ? 'Saved' : 'Save university'}
            </Button>
            {university.website_url && (
              <a href={university.website_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)' }}>
                Visit website <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>

      {university.description && (
        <section className="card" style={{ borderRadius: 'var(--radius-2xl)', padding: '1.75rem 2rem' }}>
          <h2 className="flex items-center gap-2" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 400, color: 'var(--color-charcoal)' }}>
            <Globe2 size={18} style={{ color: 'var(--color-forest)' }} /> About
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9375rem', lineHeight: 1.7, marginTop: '0.75rem' }}>
            {university.description}
          </p>
        </section>
      )}

      {/* Programs */}
      <section>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 400, color: 'var(--color-charcoal)', marginBottom: '1rem' }}>
          Degree Programs
        </h2>
        {programs.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No programs listed" description="This university currently has no programs in the catalogue." />
        ) : (
          <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
            {programs.map((prog) => (
              <div
                key={prog.id}
                className="card card-hover"
                style={{ padding: '1.5rem', borderRadius: 'var(--radius-xl)', cursor: 'pointer' }}
                onClick={() => navigate(`/student/programs/${prog.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/student/programs/${prog.id}`); }}
              >
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 400, color: 'var(--color-charcoal)', lineHeight: 1.15 }}>
                  {prog.name}
                </h3>
                <p className="text-sm text-muted mt-2">
                  {formatDegreeLevel(prog.degree_level)} · {formatLanguage(prog.language_of_instruction)} · {formatIntake(prog.intake)}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <span className="text-sm font-semibold text-forest">{formatTuitionType(prog.tuition_type)}</span>
                  <button type="button" className="btn btn-ghost btn-sm">View <ExternalLink size={13} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
