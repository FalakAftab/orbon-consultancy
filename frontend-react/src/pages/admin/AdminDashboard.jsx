import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  FileSpreadsheet,
  GraduationCap,
  Users,
  Sparkles,
  Heart,
  Scale,
  ArrowUpRight,
} from 'lucide-react';
import { fetchAdminDashboard } from '../../api/admin';
import { ErrorState, Button } from '../../components/ui';

/**
 * Admin Dashboard — real GET /v1/admin/dashboard.
 * Shows actual counts for students, admins, universities, programs, profiles,
 * favorites, comparisons, and recommendations.
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchAdminDashboard();
      setData(res);
    } catch (err) {
      setError(err.message || 'Could not load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const stats = data
    ? [
        { label: 'Students', value: data.students ?? 0, icon: Users, tone: 'forest' },
        { label: 'Universities', value: data.universities ?? 0, icon: Building2, tone: 'blue' },
        { label: 'Programs', value: data.programs ?? 0, icon: GraduationCap, tone: 'gold' },
        { label: 'Recommendations', value: data.recommendations ?? 0, icon: Sparkles, tone: 'forest' },
        { label: 'Student Profiles', value: data.student_profiles ?? 0, icon: Users, tone: 'blue' },
        { label: 'Favorites', value: data.favorites ?? 0, icon: Heart, tone: 'gold' },
        { label: 'Comparisons', value: data.comparisons ?? 0, icon: Scale, tone: 'forest' },
        { label: 'Admins', value: data.admins ?? 0, icon: Users, tone: 'blue' },
      ]
    : [];

  return (
    <div className="admin-dashboard flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 400,
              letterSpacing: '-0.03em',
              color: 'var(--color-charcoal)',
            }}
          >
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Platform overview — live counts from the database
          </p>
        </div>

        <Button variant="primary" onClick={() => navigate('/admin/imports')}>
          <FileSpreadsheet size={15} />
          Import DAAD Data
        </Button>
      </div>

      {error ? (
        <ErrorState title="Could not load dashboard" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid grid-4" style={{ gap: 'var(--space-4)' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="grid grid-4" style={{ gap: 'var(--space-4)' }}>
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '1.35rem 1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background:
                        item.tone === 'forest'
                          ? 'rgba(11, 59, 54, 0.08)'
                          : item.tone === 'blue'
                          ? 'rgba(23, 59, 87, 0.08)'
                          : 'rgba(199, 164, 91, 0.12)',
                      color:
                        item.tone === 'forest'
                          ? 'var(--color-forest)'
                          : item.tone === 'blue'
                          ? 'var(--color-academic-blue)'
                          : '#8a6d30',
                    }}
                  >
                    <Icon size={18} />
                  </span>
                  <div style={{ marginTop: '1.1rem' }}>
                    <p
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2rem',
                        fontWeight: 400,
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        color: 'var(--color-charcoal)',
                      }}
                    >
                      {item.value}
                    </p>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-muted)',
                        marginTop: '0.35rem',
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick management links */}
          <div className="grid grid-4" style={{ gap: 'var(--space-4)' }}>
            {[
              { label: 'Universities', to: '/admin/universities', icon: Building2 },
              { label: 'Programs', to: '/admin/programs', icon: GraduationCap },
              { label: 'Students', to: '/admin/students', icon: Users },
              { label: 'Excel Import', to: '/admin/imports', icon: FileSpreadsheet },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="card card-hover"
                  style={{ padding: '1.5rem', cursor: 'pointer', borderRadius: 'var(--radius-xl)' }}
                  onClick={() => navigate(item.to)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') navigate(item.to); }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: 'rgba(11, 59, 54, 0.08)',
                        color: 'var(--color-forest)',
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <ArrowUpRight size={16} className="text-muted" />
                  </div>
                  <p style={{ fontWeight: 600, color: 'var(--color-charcoal)', marginTop: '1rem' }}>{item.label}</p>
                  <p className="text-xs text-muted">Manage</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
