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
      <div className="dashboard-header" style={{ marginBottom: 'var(--space-4)' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.35rem, 3vw, 2rem)',
            fontWeight: 600,
            letterSpacing: 'var(--letter-spacing-tight)',
            color: 'var(--color-charcoal)',
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '0.8125rem', marginTop: '0.15rem' }}>
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
        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Premium welcome header */}
          <WelcomeCard profile={profile} />

          {/* Stats row (compact 3-column row on mobile) */}
          <DashboardStats stats={stats} profile={profile} loading={loading} />

          {/* Quick Actions (prioritized near top on mobile < 960px) */}
          <div className="dashboard-mobile-quick-actions">
            <QuickActions compact />
          </div>

          {/* Upcoming Deadlines (prioritized near top on mobile < 960px) */}
          <div className="dashboard-mobile-deadlines">
            <UpcomingDeadlines shortlistEntries={shortlistEntries} loading={loading} />
          </div>

          {/* Main content: 2 columns on desktop (>= 960px), 1 col on mobile */}
          <div
            className="dashboard-grid-two-col"
            style={{
              gap: 'var(--space-6)',
              alignItems: 'start',
            }}
          >
            {/* Main column */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <RecentRecommendations entries={historyEntries} loading={loading} />
              <LatestPrograms programs={programs} loading={loading} />
              <RecommendedUniversities universities={universities} loading={loading} />
              <ActivityTimeline
                historyEntries={historyEntries}
                shortlistEntries={shortlistEntries}
                loading={loading}
              />
            </div>

            {/* Right sidebar (desktop only >= 960px) */}
            <aside className="dashboard-desktop-sidebar flex flex-col gap-6">
              <UpcomingDeadlines shortlistEntries={shortlistEntries} loading={loading} />
              <QuickActions />
            </aside>

          </div>
        </div>
      )}
    </div>
  );
}
