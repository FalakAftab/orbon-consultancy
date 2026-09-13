import { Link } from 'react-router-dom';
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
        {entries && entries.length > 0 && (
          <Link
            to="/student/shortlist"
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
            title="No deadlines saved"
            description="Shortlist a program to see its application deadlines."
          />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {entries.slice(0, 3).map((entry) => (
              <li
                key={entry.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5"
                style={{ padding: '0.35rem 0' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium ellipsis" title={entry.program?.name}>{entry.program?.name || 'Program'}</p>
                  <p className="text-xs text-muted ellipsis mt-0.5">
                    {entry.university?.name || 'University'} · {formatIntake(entry.program?.intake)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  {entry.program?.deadline_winter_text && (
                    <Badge tone="info" className="text-xs">Winter: {entry.program.deadline_winter_text}</Badge>
                  )}
                  {entry.program?.deadline_summer_text && (
                    <Badge tone="accent" className="text-xs">
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
