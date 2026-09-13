import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState } from '../../ui';
import { formatDegreeLevel, money } from '../../../lib/format';

/**
 * Latest programs from GET /programs (existing endpoint).
 */
export function LatestPrograms({ programs, loading }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Latest Programs</CardTitle>
          <CardDescription>Newly added study programs.</CardDescription>
        </div>
        {programs && programs.length > 0 && (
          <Link
            to="/student/programs"
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
            Explore all &rarr;
          </Link>
        )}
      </CardHeader>
      <CardBody>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : programs.length === 0 ? (
          <EmptyState
            title="No programs available"
            description="Programs will appear here once available."
          />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {programs.slice(0, 3).map((program) => (
              <li
                key={program.id}
                className="flex items-center justify-between gap-2"
                style={{ padding: '0.35rem 0' }}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium ellipsis" title={program.name}>{program.name}</p>
                  <p className="text-xs text-muted ellipsis mt-0.5">
                    {program.university?.name || 'University'} ·{' '}
                    {formatDegreeLevel(program.degree_level)}
                  </p>
                </div>
                <Badge tone={program.tuition_type === 'free' ? 'success' : 'neutral'} className="shrink-0 text-xs">
                  {money(program.tuition_fee)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

export default LatestPrograms;
