import { Sparkles, BookmarkCheck, Search, User } from 'lucide-react';
import { StatisticCard } from '../../ui';

const PROFILE_FIELD_KEYS = [
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

/**
 * Row of four stat tiles derived from real API data.
 * Labels match the "Matches Found / Programs Shortlisted / Searches Made /
 * Profile Completion" layout from the product design.
 */
export function DashboardStats({ stats, loading }) {
  return (
    <div className="dashboard-stats-grid">
      <StatisticCard
        label="Matches Found"
        shortLabel="Matches"
        value={stats.recommendedPrograms}
        icon={Sparkles}
        tone="primary"
        loading={loading}
      />
      <StatisticCard
        label="Programs Shortlisted"
        shortLabel="Shortlist"
        value={stats.shortlistedPrograms}
        icon={BookmarkCheck}
        tone="accent"
        loading={loading}
      />
      <StatisticCard
        label="Searches Made"
        shortLabel="Searches"
        value={stats.applications}
        icon={Search}
        tone="success"
        loading={loading}
      />
    </div>
  );
}


export default DashboardStats;
