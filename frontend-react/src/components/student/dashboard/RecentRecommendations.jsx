import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState } from '../../ui';
import { formatDateTime, formatDegreeLevel } from '../../../lib/format';

/**
 * Compact list of the most recent recommendation runs.
 */
export function RecentRecommendations({ entries, loading }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Recommendations</CardTitle>
          <CardDescription>Your latest study matches.</CardDescription>
        </div>
        {entries && entries.length > 0 && (
          <Link
            to="/student/history"
            style={{
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--color-forest)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              flexShrink: 0,
            }}
          >
            View all &rarr;
          </Link>
        )}
      </CardHeader>
      <CardBody>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : entries.length === 0 ? (
          <EmptyState
            title="No recommendations yet"
            description="Run your first recommendation to see matches here."
          />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {entries.slice(0, 3).map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between gap-2"
                style={{ padding: '0.35rem 0' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium ellipsis">
                    {entry.preferred_degree ? formatDegreeLevel(entry.preferred_degree) : 'Recommendation'}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{formatDateTime(entry.created_at)}</p>
                </div>
                <Badge tone="primary" className="shrink-0 text-xs">
                  {entry.program_match_count} matches
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

export default RecentRecommendations;
