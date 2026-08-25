import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState } from '../../ui';
import { formatDateTime, formatShortlistStatus } from '../../../lib/format';

/**
 * Merged activity timeline of recent recommendation runs and shortlist
 * status changes. Both sources come from existing endpoints.
 */
function buildTimeline(historyEntries, shortlistEntries) {
  const events = [];

  (historyEntries || []).forEach((entry) => {
    events.push({
      id: `rec-${entry.id}`,
      date: entry.created_at,
      label: 'Ran a recommendation',
      detail: entry.preferred_degree
        ? `${entry.program_match_count} matches found`
        : null,
      tone: 'primary',
    });
  });

  (shortlistEntries || []).forEach((entry) => {
    (entry.status_history || []).forEach((h, index) => {
      events.push({
        id: `st-${entry.id}-${index}`,
        date: h.changed_at,
        label: 'Application status updated',
        detail: `${formatShortlistStatus(h.old_status)} → ${formatShortlistStatus(h.new_status)}`,
        tone: 'accent',
      });
    });
  });

  return events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
}

export function ActivityTimeline({ historyEntries, shortlistEntries, loading }) {
  const events = buildTimeline(historyEntries, shortlistEntries);

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions across the platform.</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : events.length === 0 ? (
          <EmptyState
            title="No recent activity"
            description="Your recommendations and status updates will appear here."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {events.map((event) => (
              <li key={event.id} className="flex items-start gap-3">
                <span
                  className="mt-1"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background:
                      event.tone === 'accent' ? 'var(--color-accent-600)' : 'var(--color-primary-600)',
                    flexShrink: 0,
                  }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{event.label}</p>
                  {event.detail && <Badge tone="neutral" className="mt-1">{event.detail}</Badge>}
                  <p className="text-xs text-muted mt-1">{formatDateTime(event.date)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

export default ActivityTimeline;
