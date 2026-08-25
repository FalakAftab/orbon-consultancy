import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState } from '../../ui';
import { formatIntake } from '../../../lib/format';

/**
 * Deadlines derived from shortlisted programs.
 * NOTE: Backend returns raw text for deadlines (deadline_winter_text /
 * deadline_summer_text), not parseable dates — so they are displayed as
 * informational text, not sorted numerically.
 */
export function UpcomingDeadlines({ shortlistEntries, loading }) {
  const entries = (shortlistEntries || []).filter(
    (entry) => entry.program?.deadline_winter_text || entry.program?.deadline_summer_text
  );

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Upcoming Deadlines</CardTitle>
          <CardDescription>From your shortlisted programs.</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : entries.length === 0 ? (
          <EmptyState
            title="No deadlines saved"
            description="Shortlist a program to see its application deadlines."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {entries.slice(0, 5).map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium ellipsis">{entry.program?.name || 'Program'}</p>
                  <p className="text-xs text-muted">
                    {entry.university?.name || 'University'} · {formatIntake(entry.program?.intake)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {entry.program?.deadline_winter_text && (
                    <Badge tone="info">Winter: {entry.program.deadline_winter_text}</Badge>
                  )}
                  {entry.program?.deadline_summer_text && (
                    <Badge tone="accent" className="mt-1">
                      Summer: {entry.program.deadline_summer_text}
                    </Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

export default UpcomingDeadlines;
