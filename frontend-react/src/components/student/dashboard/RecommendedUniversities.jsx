import { Link } from 'react-router-dom';
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
        {universities && universities.length > 0 && (
          <Link
            to="/student/universities"
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
        ) : universities.length === 0 ? (
          <EmptyState
            title="No universities available"
            description="Universities will appear here once available."
          />
        ) : (
          <ul className="flex flex-col gap-2.5">
            {universities.slice(0, 3).map((uni) => (
              <li key={uni.id} className="flex items-center gap-2.5" style={{ padding: '0.35rem 0' }}>
                <Avatar name={uni.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium ellipsis" title={uni.name}>{uni.name}</p>
                  <p className="text-xs text-muted ellipsis mt-0.5">
                    {uni.city || 'Germany'}
                    {uni.ranking ? ` · Rank #${uni.ranking}` : ''}
                  </p>
                </div>
                <Badge tone={uni.tuition_type === 'free' ? 'success' : 'neutral'} className="shrink-0 text-xs">
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
