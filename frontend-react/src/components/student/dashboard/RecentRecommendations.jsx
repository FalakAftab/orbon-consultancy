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
          <ul className="flex flex-col gap-3">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium ellipsis">
                    {entry.preferred_degree ? formatDegreeLevel(entry.preferred_degree) : 'Recommendation'}
                  </p>
                  <p className="text-xs text-muted">{formatDateTime(entry.created_at)}</p>
                </div>
                <Badge tone="primary">{entry.program_match_count} matches</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

export default RecentRecommendations;
