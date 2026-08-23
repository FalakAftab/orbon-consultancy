import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MatchRing } from '../../components/shared/PremiumVisuals';
import { ViewToggle } from '../../components/shared/ViewToggle';
import {
  saveShortlist,
  fetchRecommendationHistory,
  fetchRecommendationHistoryDetail,
} from '../../api/student';
import {
  SlidersHorizontal,
  Bookmark,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search,
} from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

import { EmptyState, ErrorState, Button } from '../../components/ui';
import {
  formatDegreeLevel,
  formatLanguage,
  formatIntake,
  formatTuitionType,
  formatDate,
} from '../../lib/format';

const VIEW_KEY = 'studypath_results_view';

// Programs from the API don't include a photo — cycle through the campus
// photos already bundled in /public so result cards aren't a bare text block.
const PLACEHOLDER_PHOTOS = ['/assets/results/card-1.jpg', '/assets/results/card-2.jpg', '/assets/results/card-3.jpg'];

/**
 * Recommendation Results — displays real recommendation payload returned from
 * POST /v1/recommendations (via RecommendationService) or fetched from history.
 */
function normalizeProgram(item) {
  const program = item.program || item;
  const university = item.university || program.university || {};
  const match = item.match_percentage ?? item.score ?? item.match ?? null;

  return {
    programId: program.id ?? item.program_id ?? item.id,
    programName: program.name ?? item.program_name,
    uniName: university.name ?? item.university_name ?? 'German University',
    city: university.city ?? item.city ?? '',
    degree: program.degree_level ?? item.degree,
    tuitionType: program.tuition_type ?? item.tuition_type,
    tuitionFee: program.tuition_fee ?? item.tuition_fee,
    language: program.language_of_instruction ?? item.language ?? 'English',
    intake: program.intake ?? item.intake,
    admissionMethod: program.admission_method ?? item.admission_method ?? null,
    deadlineWinter: program.deadline_winter ?? item.deadline_winter,
    deadlineSummer: program.deadline_summer ?? item.deadline_summer,
    eligibilityStatus: item.eligibility_status,
    rationale: item.rationale,
    reasons: item.reasons || program.reasons || [],
    unmatched: item.unmatched_requirements || [],
    match,
  };
}

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedIds, setSavedIds] = useState(new Set());
  const [saveMessage, setSaveMessage] = useState('');
  const [view, setView] = useState(() => {
    try {
      return localStorage.getItem(VIEW_KEY) || 'grid';
    } catch {
      return 'grid';
    }
  });
  const [sortBy, setSortBy] = useState('match_desc');
  const [filterAdmission, setFilterAdmission] = useState('all');

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* ignore */
    }
  };

  // The criteria snapshot used to generate this result set (for refining).
  const criteriaSnapshot =
    location.state?.criteria ||
    resultsData?.criteria_snapshot ||
    resultsData?.criteria ||
    null;

  useEffect(() => {
    // If a specific history entry was requested, fetch its detail.
    if (location.state?.historyEntryId) {
      setLoading(true);
      setError('');
      fetchRecommendationHistoryDetail(location.state.historyEntryId)
        .then((res) => setResultsData(res?.data || null))
        .catch((err) => setError(err.message || 'Could not load recommendation results.'))
        .finally(() => setLoading(false));
      return;
    }

    // If state was passed from the wizard submission:
    if (location.state?.recommendationResult) {
      setResultsData(location.state.recommendationResult);
      try {
        localStorage.setItem('studypath_latest_results', JSON.stringify(location.state.recommendationResult));
      } catch (e) {
        /* ignore */
      }
    } else {
      // Check cached results in localStorage first
      try {
        const cached = localStorage.getItem('studypath_latest_results');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed) {
            setResultsData(parsed);
            return;
          }
        }
      } catch (e) {
        /* ignore */
      }

      // Otherwise fetch latest run from recommendation history API
      setLoading(true);
      setError('');
      fetchRecommendationHistory(1)
        .then((res) => {
          if (res?.data && res.data.length > 0) {
            const first = res.data[0];
            setResultsData(first.results || first);
          } else {
            setResultsData(null);
          }
        })
        .catch((err) => setError(err.message || 'Could not load recommendation results.'))
        .finally(() => setLoading(false));
    }
  }, [location.state]);

  const handleSaveShortlist = async (programId) => {
    if (!programId) return;
    try {
      await saveShortlist(programId);
      setSavedIds((prev) => new Set(prev).add(programId));
      setSaveMessage('Program added to your shortlist.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage(err.message || 'Could not save to shortlist.');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const programs = resultsData?.programs || resultsData?.matched_programs || resultsData?.recommendations || [];
  const totalMatches =
    resultsData?.total_matches ??
    resultsData?.program_match_count ??
    (Array.isArray(programs) ? programs.length : 0);

  // Client-side sort — the backend already ranks by match score, but the
  // "Sort by" control lets the student flip that ordering without a re-run.
  const sortedPrograms = Array.isArray(programs)
    ? [...programs].sort((a, b) => {
        const pa = normalizeProgram(a);
        const pb = normalizeProgram(b);
        if (sortBy === 'match_asc') return (pa.match ?? 0) - (pb.match ?? 0);
        if (sortBy === 'name_asc') return (pa.programName || '').localeCompare(pb.programName || '');
        return (pb.match ?? 0) - (pa.match ?? 0); // match_desc (default)
      })
    : programs;

  const filteredPrograms = Array.isArray(sortedPrograms)
    ? sortedPrograms.filter((item) => {
        const p = normalizeProgram(item);

        // Admission method filter
        if (filterAdmission === 'direct_portal') {
          if (p.admissionMethod !== 'direct_portal' && p.admissionMethod !== 'both') return false;
        } else if (filterAdmission === 'uni_assist') {
          if (p.admissionMethod !== 'uni_assist' && p.admissionMethod !== 'both') return false;
        }

        // Text search filter
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.trim().toLowerCase();
        return (
          (p.uniName && p.uniName.toLowerCase().includes(q)) ||
          (p.programName && p.programName.toLowerCase().includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q)) ||
          (p.degree && p.degree.toLowerCase().includes(q))
        );
      })
    : [];

  return (
    <div className="results-page flex flex-col gap-6">
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
            Matched Recommendation Results
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            {totalMatches ? `${totalMatches} matches generated from your academic profile.` : 'Recommended programs tailored to your preferences.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="search-bar" style={{ minWidth: 240 }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search results..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {totalMatches > 0 && (
            <span className="badge badge-primary" style={{ borderRadius: 'var(--radius-full)' }}>
              {totalMatches} programs found
            </span>
          )}
          <select
            className="input select"
            style={{ width: 'auto', minWidth: 180 }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort programs"
          >
            <option value="match_desc">Best Match (High to Low)</option>
            <option value="match_asc">Match (Low to High)</option>
            <option value="name_asc">Program Name (A–Z)</option>
          </select>
          <select
            className="input select"
            style={{ width: 'auto', minWidth: 190 }}
            value={filterAdmission}
            onChange={(e) => setFilterAdmission(e.target.value)}
            aria-label="Filter by admission method"
          >
            <option value="all">All Application Methods</option>
            <option value="direct_portal">Direct Portal Only</option>
            <option value="uni_assist">Uni-Assist Only</option>
          </select>
          <ViewToggle value={view} onChange={changeView} />
          <Button
            variant="secondary"
            onClick={() =>
              navigate('/student/wizard', {
                state: criteriaSnapshot
                  ? { criteria: criteriaSnapshot, refining: true, from: 'results' }
                  : { refining: true, from: 'results' },
              })
            }
          >
            <SlidersHorizontal size={15} />
            Refine Criteria
          </Button>
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
          <CheckCircle2 size={16} />
          {saveMessage}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius-2xl)' }} />
          ))}
        </div>
      ) : error ? (
        <ErrorState title="Could not load results" description={error} onRetry={() => navigate('/student/wizard')} />
      ) : !Array.isArray(programs) || programs.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No recommendations yet"
          description="Run the Recommendation Wizard to get matched with top German universities."
          action={<Button variant="primary" onClick={() => navigate('/student/wizard')}>Start Recommendation Wizard <ArrowRight size={15} /></Button>}
        />
) : view === 'grid' ? (
        <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
          {filteredPrograms.map((item, idx) => {

            const p = normalizeProgram(item);
            const matchScore = p.match ?? 0;
            const isSaved = p.programId ? savedIds.has(p.programId) : false;

            return (
              <div
                key={p.programId || idx}
                className="results-card"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-2xl)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', aspectRatio: '16 / 9' }}>
                  <img
                    src={PLACEHOLDER_PHOTOS[idx % PLACEHOLDER_PHOTOS.length]}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {p.city && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(14, 27, 46, 0.82)',
                        color: 'var(--color-ivory)',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                      }}
                    >
                      {p.city}
                    </span>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--color-gold)',
                      color: '#0e1b2e',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                    }}
                  >
                    {Math.round(matchScore)}% Match
                  </span>
                </div>

                <div style={{ padding: '1.5rem 1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      style={{
                        fontSize: '0.70rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.10em',
                        color: 'var(--color-muted)',
                        fontWeight: 600,
                      }}
                    >
                      {p.uniName}
                    </p>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        fontWeight: 400,
                        letterSpacing: '-0.02em',
                        color: 'var(--color-charcoal)',
                        marginTop: '0.35rem',
                      }}
                    >
                      {p.programName}
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-muted)', marginTop: '0.25rem' }}>
                      {formatDegreeLevel(p.degree)} {p.city ? `· ${p.city}` : ''}
                    </p>
                  </div>
                </div>

                <div
                  className="grid grid-2"
                  style={{
                    gap: '0.9rem',
                    marginTop: '1.15rem',
                    paddingTop: '1.15rem',
                    borderTop: '1px solid var(--color-border)',
                  }}
                >
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted font-semibold">Tuition</span>
                    <p className="font-semibold text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
{formatTuitionType(p.tuitionType, p.tuitionFee)} {p.tuitionFee && p.tuitionFee > 0 ? `· €${p.tuitionFee}` : ''}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted font-semibold">Language</span>
                    <p className="font-semibold text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
                      {formatLanguage(p.language)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted font-semibold">Intake</span>
                    <p className="font-semibold text-sm mt-1" style={{ color: 'var(--color-charcoal)' }}>
                      {formatIntake(p.intake)}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wide text-muted font-semibold">Eligibility</span>
                    <p className="font-semibold text-sm mt-1" style={{ color: 'var(--color-forest)' }}>
                      {p.eligibilityStatus || (p.reasons.length ? 'Match found' : 'Eligible')}
                    </p>
                  </div>
                </div>

                {Array.isArray(p.reasons) && p.reasons.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.reasons.map((reason, i) => (
                      <span key={i} className="badge badge-primary">{reason}</span>
                    ))}
                  </div>
                )}

                <div
                  className="flex items-center justify-between gap-3 flex-wrap mt-auto pt-4"
                  style={{ borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}
                >
                  {p.programId ? (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(`/student/programs/${p.programId}`)}>
                      View <ExternalLink size={14} />
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    onClick={() => handleSaveShortlist(p.programId)}
                    disabled={isSaved || !p.programId}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    <Bookmark size={14} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col" style={{ gap: 'var(--space-3)' }}>
          {filteredPrograms.map((item, idx) => {

            const p = normalizeProgram(item);
            const matchScore = p.match ?? 0;
            const isSaved = p.programId ? savedIds.has(p.programId) : false;

            return (
              <div
                key={p.programId || idx}
                className="results-row"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.1rem 1.5rem',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <p style={{ fontSize: '0.70rem', textTransform: 'uppercase', letterSpacing: '0.10em', color: 'var(--color-muted)', fontWeight: 600 }}>
                    {p.uniName} {p.city ? `· ${p.city}` : ''}
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
                    {p.programName}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: '0.15rem' }}>
{formatDegreeLevel(p.degree)} · {formatLanguage(p.language)} · {formatTuitionType(p.tuitionType, p.tuitionFee)} · {formatIntake(p.intake)}
                  </p>
                </div>

                <MatchRing value={Math.round(matchScore)} tone="gold" />

                <div className="flex items-center gap-2 flex-wrap">
                  {p.programId && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate(`/student/programs/${p.programId}`)}>
                      View <ExternalLink size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleSaveShortlist(p.programId)}
                    disabled={isSaved || !p.programId}
                    className="btn btn-primary btn-sm"
                    style={{ borderRadius: 'var(--radius-full)' }}
                  >
                    <Bookmark size={14} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}