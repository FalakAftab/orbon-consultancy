import { Card, CardHeader, CardTitle, CardDescription, CardBody, Button } from '../../ui';
import { useNavigate } from 'react-router-dom';

/**
 * Profile completion progress bar.
 * Derived from the student profile fields returned by GET /student/profile.
 */
const FIELD_KEYS = [
  'first_name',
  'last_name',
  'phone',
  'country',
  'last_degree',
  'obtained_gpa',
  'maximum_gpa',
  'graduation_year',
  'english_test_type',
  'german_level',
  'preferred_degree',
  'preferred_intake',
];

export function ProfileCompletion({ profile, loading }) {
  const navigate = useNavigate();

  const filled = profile ? FIELD_KEYS.filter((key) => Boolean(profile[key])).length : 0;
  const percent = profile ? Math.round((filled / FIELD_KEYS.length) * 100) : 0;

  // Don't clutter the dashboard if profile is already 100% complete
  if (!loading && percent >= 100) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>Complete your academic details for better matches.</CardDescription>
        </div>
      </CardHeader>
      <CardBody>
        {loading ? (
          <p className="text-muted text-sm">Loading…</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{percent}%</span>
              <span className="text-xs text-muted">
                {filled}/{FIELD_KEYS.length} fields
              </span>
            </div>
            <div
              className="skeleton"
              style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-surface-subtle)' }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${percent}%`,
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--color-primary-600)',
                }}
              />
            </div>
            <p className="text-sm text-muted mt-3">
              Add your academic details to get more accurate recommendations.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => navigate('/student/wizard')}
            >
              Complete profile
            </Button>
          </>
        )}
      </CardBody>
    </Card>
  );
}


export default ProfileCompletion;
