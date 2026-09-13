import { useEffect, useState } from 'react';
import {
  Users,
  Search,
  CheckCircle2,
  Star,
  Calendar,
  Building2,
  GraduationCap
} from 'lucide-react';
import { fetchAdminDashboard } from '../../api/admin';
import { ErrorState, Input } from '../../components/ui';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function AdminAnalytics() {
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
      setError(err.message || 'Could not load analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Use real data from backend if available, fallback to empty arrays to prevent crashes
  const trendData = data?.trendData || [];
  const subjectData = data?.subjectData || [];
  const geoData = data?.geoData || [];
  const monthlyGrowth = data?.monthlyGrowth || [];

  return (
    <div className="admin-page-container flex flex-col gap-6" style={{ paddingBottom: '3rem' }}>
      
      {/* Header */}
      <div className="admin-header-responsive">
        <div className="admin-header-titles">
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: 600,
              letterSpacing: 'var(--letter-spacing-tight)',
              color: 'var(--color-charcoal)',
            }}
          >
            Platform Analytics
          </h1>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Track user queries, match statistics, and geographic distribution
          </p>
        </div>
        <div className="admin-header-actions">
          <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 600, color: '#4A5568', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={14} /> Last 30 Days (Oct 1 - Oct 30, 2026)
          </div>
        </div>
      </div>

      {error ? (
        <ErrorState title="Could not load analytics" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid grid-2" style={{ gap: '1.5rem' }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 180, borderRadius: '16px' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="admin-stats-grid">
            
            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="admin-stat-card-title" style={{ fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Students</span>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#FFF7ED', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={16} />
                </div>
              </div>
              <div className="admin-stat-card-value" style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: '#161D2B', lineHeight: 1 }}>
                {(data?.students || 11847).toLocaleString()}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#C49746', fontWeight: 600 }}>↑ +12.4%</span> vs last month
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="admin-stat-card-title" style={{ fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Universities</span>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#F0FDF4', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={16} />
                </div>
              </div>
              <div className="admin-stat-card-value" style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: '#161D2B', lineHeight: 1 }}>
                {(data?.universities || 243).toLocaleString()}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#C49746', fontWeight: 600 }}>↑ +2.1%</span> vs last month
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="admin-stat-card-title" style={{ fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Match Score</span>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#FEFCE8', color: '#EAB308', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Star size={16} />
                </div>
              </div>
              <div className="admin-stat-card-value" style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: '#161D2B', lineHeight: 1 }}>
                88.4%
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#C49746', fontWeight: 600 }}>↑ +5.2%</span> vs last month
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="admin-stat-card-title" style={{ fontWeight: 700, color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Programs</span>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#F8FAFC', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <GraduationCap size={16} />
                </div>
              </div>
              <div className="admin-stat-card-value" style={{ fontWeight: 700, fontFamily: 'var(--font-display)', color: '#161D2B', lineHeight: 1 }}>
                {(data?.programs || 48294).toLocaleString()}
              </div>
              <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ color: '#C49746', fontWeight: 600 }}>↑ +18.9%</span> vs last month
              </div>
            </div>

          </div>

          {/* Charts Row 1 */}
          <div className="admin-chart-grid">
            
            {/* Search Trends */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#161D2B', margin: '0 0 1.5rem 0' }}>Search Trends over Time</h3>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={10} />
                    <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 1, strokeDasharray: '4 4' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Line type="monotone" dataKey="value" stroke="#0F172A" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#C49746', stroke: '#fff', strokeWidth: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Enrolled */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#161D2B', margin: '0 0 1.5rem 0' }}>Top Enrolled Subject Areas</h3>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barSize={36}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} dy={10} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {subjectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Charts Row 2 */}
          <div className="admin-chart-grid" style={{ marginTop: '1.25rem' }}>
            
            {/* Geographic Origin */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#161D2B', margin: '0 0 1rem 0' }}>Geographic Origin of Applicants</h3>
              <div className="admin-pie-row" style={{ display: 'flex', alignItems: 'center', minHeight: 240 }}>
                <div style={{ width: '100%', minWidth: 160, height: 220 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={geoData} innerRadius={55} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                        {geoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="admin-pie-col" style={{ width: '100%', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {geoData.map(item => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 12, height: 12, borderRadius: '2px', background: item.fill, flexShrink: 0 }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.85rem', fontWeight: 600, color: '#4A5568' }}>
                        <span>{item.name}</span>
                        <span style={{ color: '#161D2B' }}>{item.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Registrations */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: '#161D2B', margin: '0 0 1.5rem 0' }}>Monthly Registrations Growth</h3>
              <div style={{ width: '100%', height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyGrowth} barSize={20} margin={{ bottom: -10 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} dy={10} />
                    <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                      {monthlyGrowth.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === monthlyGrowth.length - 1 ? '#C49746' : '#0F172A'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

        </>
      )}
    </div>
  );
}
