import { Card, CardHeader, CardTitle, CardDescription, CardBody, Badge, EmptyState, Avatar } from '../../ui';
import { formatTuitionType } from '../../../lib/format';

/**
 * Recommended universities.
 * Uses universities fetched from GET /universities (existing endpoint).
 */
export function RecommendedUniversities({ universities, loading }) {
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Recommended Universities</CardTitle>
          <CardDescription>Explore top German universities.</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : universities.length === 0 ? (
          <EmptyState
            title="No universities available"
            description="Universities will appear here once available."
          />
        ) : (
          <ul className="flex flex-col gap-3">
            {universities.slice(0, 5).map((uni) => (
              <li key={uni.id} className="flex items-center gap-3">
                <Avatar name={uni.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium ellipsis">{uni.name}</p>
                  <p className="text-xs text-muted">
                    {uni.city || 'Germany'}
                    {uni.ranking ? ` · Rank #${uni.ranking}` : ''}
                  </p>
                </div>
                <Badge tone={uni.tuition_type === 'free' ? 'success' : 'neutral'}>
                  {formatTuitionType(uni.tuition_type)}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}

export default RecommendedUniversities;
