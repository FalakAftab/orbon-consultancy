import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, ArrowRight } from 'lucide-react';
import { fetchRecommendationHistory } from '../../api/student';
import { Pagination, EmptyState, ErrorState, Button } from '../../components/ui';
import { formatDateTime, formatDegreeLevel } from '../../lib/format';

/**
 * Recommendation History — real GET /v1/recommendations/history.
 * Each entry shows run date, program count, preferred subjects & degree.
 */
const PAGE_SIZE = 10;

export default function HistoryPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchRecommendationHistory(PAGE_SIZE);
      const data = res?.data || [];
      setItems(data);
      setMeta({
        total: res?.meta?.total ?? data.length,
        last_page: res?.meta?.last_page ?? 1,
        current_page: res?.meta?.current_page ?? page,
      });
    } catch (err) {
      setError(err.message || 'Could not load recommendation history.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  const handleView = (id) => {
    navigate('/student/results', { state: { historyEntryId: id } });
  };

  return (
    <div className="history-page flex flex-col gap-6">
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
          Recommendation History
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Your past recommendation runs and the programs they surfaced
        </p>
      </div>

      {error ? (
        <ErrorState title="Could not load history" description={error} onRetry={load} />
      ) : loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 84, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No recommendation history yet"
          description="Run the Recommendation Wizard to generate your first set of matched programs."
          action={<Button variant="primary" onClick={() => navigate('/student/wizard')}>Build my recommendation <ArrowRight size={15} /></Button>}
        />
      ) : (
        <>
          <div className="grid" style={{ gap: 'var(--space-3)' }}>
            {items.map((entry) => {
              const subjects = Array.isArray(entry.preferred_subjects) ? entry.preferred_subjects : [];
              return (
                <div
                  key={entry.id}
                  className="card history-card"
                >
                  <div style={{ minWidth: 120 }}>
                    <p className="text-xs uppercase tracking-wider text-muted font-semibold">Search Date</p>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 400,
                        color: 'var(--color-charcoal)',
                        marginTop: '0.2rem',
                      }}
                    >
                      {formatDateTime(entry.created_at)}
                    </p>
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">Criteria Summary</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {subjects.length > 0 && (
                        <span className="filter-chip">Field: {subjects[0]}{subjects.length > 1 ? ` +${subjects.length - 1}` : ''}</span>
                      )}
                      {entry.preferred_degree && (
                        <span className="filter-chip">Degree: {formatDegreeLevel(entry.preferred_degree)}</span>
                      )}
                      {!subjects.length && !entry.preferred_degree && (
                        <span className="filter-chip">General recommendation run</span>
                      )}
                    </div>
                  </div>

                  <div className="history-card-results" style={{ textAlign: 'right' }}>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted font-semibold">Results</p>
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-gold)', fontWeight: 400 }}>
                        {entry.program_match_count ?? 0} Found
                      </p>
                    </div>

                    <button
                      type="button"
                      className="btn btn-icon"
                      style={{ background: 'var(--color-ivory-warm)', border: '1px solid var(--color-border)', marginLeft: '1rem' }}
                      onClick={() => handleView(entry.id)}
                      aria-label="View results"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={meta.current_page || page}
            totalPages={meta.last_page || 1}
            totalItems={meta.total}
            onPageChange={setPage}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </div>
  );
}
