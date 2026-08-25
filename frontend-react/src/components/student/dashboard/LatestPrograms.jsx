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
          <ul className="flex flex-col gap-3">
            {programs.slice(0, 5).map((program) => (
              <li key={program.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium ellipsis">{program.name}</p>
                  <p className="text-xs text-muted">
                    {program.university?.name || 'University'} ·{' '}
                    {formatDegreeLevel(program.degree_level)}
                  </p>
                </div>
                <Badge tone={program.tuition_type === 'free' ? 'success' : 'neutral'}>
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
