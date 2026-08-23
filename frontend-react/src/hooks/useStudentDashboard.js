import { useEffect, useMemo, useState } from 'react';
import {
  fetchFavorites,
  fetchPrograms,
  fetchRecommendationHistory,
  fetchShortlist,
  fetchStudentProfile,
  fetchUniversities,
} from '../api/student';

/**
 * Orchestrates all Student Dashboard data loading.
 * Uses ONLY existing Laravel endpoints (verified in backend/routes/api.php).
 * Derives the stat counts and passes raw data to presentational widgets.
 */
export function useStudentDashboard() {
  const [data, setData] = useState({
    profile: null,
    history: null,
    shortlist: null,
    favorites: null,
    programs: null,
    universities: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');

// Use allSettled so a single failing endpoint never blocks the whole
    // dashboard. Successful sections render their real data; failed sections
    // fall back to empty/error states instead of hanging on "Loading…".
    const [profileResult, historyResult, shortlistResult, favoritesResult, programsResult, universitiesResult] =
      await Promise.allSettled([
        fetchStudentProfile(),
        fetchRecommendationHistory(5),
        fetchShortlist(),
        fetchFavorites(50),
        fetchPrograms(5),
        fetchUniversities(5),
      ]);

    const valueOf = (result) => (result.status === 'fulfilled' ? result.value : null);
    const nextData = {
      profile: valueOf(profileResult),
      history: valueOf(historyResult),
      shortlist: valueOf(shortlistResult),
      favorites: valueOf(favoritesResult),
      programs: valueOf(programsResult),
      universities: valueOf(universitiesResult),
    };

    setData(nextData);

    // Only surface an error banner if EVERY request failed; otherwise partial
    // data is shown with per-widget empty/error states.
    const results = [profileResult, historyResult, shortlistResult, favoritesResult, programsResult, universitiesResult];
    const failedCount = results.filter((result) => result.status === 'rejected').length;

    if (failedCount === results.length) {
      setError('Could not load dashboard data. Please try again.');
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Derive stat counts from the raw API responses.
  const stats = useMemo(() => {
    const historyEntries = data.history?.data || [];
    const lastHistory = historyEntries[0];
    const shortlistEntries = data.shortlist?.data || [];
    const favoriteEntries = data.favorites?.data || data.favorites?.items || [];

    // "Recommended Programs": total runs recorded in history meta, or the
    // latest run's program_match_count when history is non-empty.
    const recommendedPrograms = lastHistory
      ? lastHistory.program_match_count
      : data.history?.meta?.total ?? 0;

    // "Shortlisted Programs": total shortlist entries.
    const shortlistedPrograms = shortlistEntries.length;

    // "Saved Universities": distinct universities saved as favorites.
    const savedUniversities = new Set(
      favoriteEntries.map((fav) => fav?.university_id ?? fav?.university?.id).filter(Boolean)
    ).size;

    // "Applications": shortlist entries that have moved past "pending".
    const applications = shortlistEntries.filter(
      (entry) => entry.status && entry.status !== 'pending'
    ).length;

    return {
      recommendedPrograms,
      shortlistedPrograms,
      savedUniversities,
      applications,
    };
  }, [data]);

  const profile = data.profile?.profile || null;
  const historyEntries = data.history?.data || [];
  const shortlistEntries = data.shortlist?.data || [];
  const favoriteEntries = data.favorites?.data || data.favorites?.items || [];
  const programs = data.programs?.data || data.programs?.items || [];
  const universities = data.universities?.data || data.universities?.items || [];

  return {
    loading,
    error,
    retry: load,
    stats,
    profile,
    historyEntries,
    shortlistEntries,
    favoriteEntries,
    programs,
    universities,
  };
}
