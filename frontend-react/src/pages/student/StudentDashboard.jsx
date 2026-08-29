import { ErrorState } from '../../components/ui';
import { useStudentDashboard } from '../../hooks/useStudentDashboard';
import { WelcomeCard } from '../../components/student/dashboard/WelcomeCard';
import { DashboardStats } from '../../components/student/dashboard/DashboardStats';
import { RecentRecommendations } from '../../components/student/dashboard/RecentRecommendations';
import { UpcomingDeadlines } from '../../components/student/dashboard/UpcomingDeadlines';
import { RecommendedUniversities } from '../../components/student/dashboard/RecommendedUniversities';
import { LatestPrograms } from '../../components/student/dashboard/LatestPrograms';
import { QuickActions } from '../../components/student/dashboard/QuickActions';
import { ActivityTimeline } from '../../components/student/dashboard/ActivityTimeline';


/**
 * Student Dashboard — premium editorial layout.
 * Business logic lives in useStudentDashboard; this page only composes
 * presentational widgets. All data comes from existing Laravel endpoints.
 */
export default function StudentDashboard() {
  const {
    loading,
    error,
    retry,
    stats,
    profile,
    historyEntries,
    shortlistEntries,
    programs,
    universities,
  } = useStudentDashboard();

  return (
    <div className="dashboard-premium">
      {/* Editorial page title */}
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-8)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
            fontWeight: 400,
            letterSpacing: '-0.03em',
            color: 'var(--color-charcoal)',
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Your study journey overview
        </p>
      </div>

      {error ? (
        <ErrorState
          title="Could not load dashboard"
          description={error}
          onRetry={retry}
        />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Premium welcome header */}
          <WelcomeCard profile={profile} />

          {/* Stats row */}
          <DashboardStats stats={stats} profile={profile} loading={loading} />

          {/* Main content: 2 columns */}
          <div
            className="dashboard-grid-two-col"
            style={{
              gap: 'var(--space-6)',
              alignItems: 'start',
            }}
          >
            {/* Main column */}
            <div className="flex flex-col gap-6">
              <RecentRecommendations entries={historyEntries} loading={loading} />
              <LatestPrograms programs={programs} loading={loading} />
              <RecommendedUniversities universities={universities} loading={loading} />
              <ActivityTimeline
                historyEntries={historyEntries}
                shortlistEntries={shortlistEntries}
                loading={loading}
              />
            </div>

            {/* Right sidebar */}
            <aside className="flex flex-col gap-6">
              <UpcomingDeadlines shortlistEntries={shortlistEntries} loading={loading} />
              <QuickActions />
            </aside>

          </div>
        </div>
      )}
    </div>
  );
}
