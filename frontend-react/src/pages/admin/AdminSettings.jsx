import { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  RefreshCw, 
  ShieldCheck, 
  Database, 
  Server,
  Building2,
  BookOpen,
  Users,
  Activity,
  Globe,
  Settings,
  User,
  Mail,
  Phone,
  MapPin,
  Save
} from 'lucide-react';
import { fetchAdminDashboard, clearSystemCache, updateAdminProfile } from '../../api/admin';
import { api } from '../../api/client';
import { ErrorState, Input } from '../../components/ui';

export default function AdminSettings() {
  const [data, setData] = useState(null);
  const [adminUser, setAdminUser] = useState({
    name: '',
    email: '',
    phone: '',
    country: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [clearingCache, setClearingCache] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [res, meRes] = await Promise.all([
        fetchAdminDashboard(),
        api('/auth/me')
      ]);
      setData(res);
      setAdminUser({
        name: meRes.name || '',
        email: meRes.email || '',
        phone: meRes.phone || '',
        country: meRes.country || ''
      });
    } catch (err) {
      setError(err.message || 'Could not load system status.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleClearCache = async () => {
    setClearingCache(true);
    try {
      const res = await clearSystemCache();
      showToast(res.message || 'System cache cleared successfully.');
    } catch (err) {
      alert(err.message || 'Failed to clear cache.');
    } finally {
      setClearingCache(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const res = await updateAdminProfile(adminUser);
      setProfileMsg('Profile updated successfully.');
      showToast('Profile updated successfully.');
    } catch (err) {
      setProfileMsg(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="admin-settings flex flex-col gap-6" style={{ paddingBottom: '3rem' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: '#0F172A',
          color: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          zIndex: 9999,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <CheckCircle2 size={18} style={{ color: '#10B981' }} />
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{toastMsg}</span>
        </div>
      )}

      {/* Hero Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '20px',
          padding: '2.5rem 3rem',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                borderRadius: '999px',
                background: 'rgba(196, 151, 70, 0.15)',
                border: '1px solid rgba(196, 151, 70, 0.3)',
                color: '#C49746',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                marginBottom: '1rem',
              }}
            >
              <Settings size={14} /> PLATFORM PREFERENCES
            </div>
            <h1
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: '#ffffff',
                marginBottom: '0.5rem',
              }}
            >
              System Settings & Profile
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.8)', maxWidth: '500px' }}>
              Manage your Orbon Consultancy platform configurations, view system health, and update your personal admin details.
            </p>
          </div>
          
          <button
            onClick={load}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
            onMouseOut={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)')}
          >
            <RefreshCw size={16} /> Sync Status
          </button>
        </div>
        
        {/* Decorative background element */}
        <div style={{ position: 'absolute', right: '-5%', top: '-20%', opacity: 0.05, pointerEvents: 'none' }}>
          <Settings size={300} />
        </div>
      </div>

      {error ? (
        <ErrorState title="Could not load system status" description={error} onRetry={load} />
      ) : loading ? (
        <div className="grid grid-3" style={{ gap: '1.5rem', marginTop: '1.5rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 140, borderRadius: '16px' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Top Status & Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            {/* Health Card */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '1.75rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.05)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', right: '-10px', top: '-10px', color: '#10B981', opacity: 0.05 }}>
                <Activity size={120} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>All Systems Operational</h3>
                  <p style={{ fontSize: '0.85rem', color: '#10B981', fontWeight: 600, margin: '0.2rem 0 0' }}>API is responding normally</p>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#718096', lineHeight: 1.5 }}>
                The core backend services, database connections, and authentication endpoints are fully functional.
              </p>
            </div>

            {/* Database Stats */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.08)',
              padding: '1.75rem',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              gridColumn: 'auto / span 2',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#161D2B', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} style={{ color: '#C49746' }} /> Database Overview
              </h3>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <Building2 size={16} /> Universities
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#161D2B' }}>{data?.universities ?? '—'}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)' }}></div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <BookOpen size={16} /> Programs
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#161D2B' }}>{data?.programs ?? '—'}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(0,0,0,0.08)' }}></div>
                <div style={{ flex: 1, minWidth: '120px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#718096', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    <Users size={16} /> Students
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#161D2B' }}>{data?.students ?? '—'}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            
            {/* Admin Profile Form */}
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <User size={18} style={{ color: '#C49746' }} /> Admin Profile
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.2rem' }}>Update your personal details</p>
              </div>
              
              <form onSubmit={handleSaveProfile} style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.4rem' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                        <User size={16} />
                      </span>
                      <Input
                        required
                        type="text"
                        value={adminUser.name}
                        onChange={(e) => setAdminUser({...adminUser, name: e.target.value})}
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.4rem' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                        <Mail size={16} />
                      </span>
                      <Input
                        required
                        type="email"
                        value={adminUser.email}
                        onChange={(e) => setAdminUser({...adminUser, email: e.target.value})}
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.4rem' }}>
                        Phone Number
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                          <Phone size={16} />
                        </span>
                        <Input
                          type="text"
                          placeholder="Optional"
                          value={adminUser.phone}
                          onChange={(e) => setAdminUser({...adminUser, phone: e.target.value})}
                          style={{ paddingLeft: '2.5rem' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.4rem' }}>
                        Country
                      </label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                          <MapPin size={16} />
                        </span>
                        <Input
                          type="text"
                          placeholder="Optional"
                          value={adminUser.country}
                          onChange={(e) => setAdminUser({...adminUser, country: e.target.value})}
                          style={{ paddingLeft: '2.5rem' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {profileMsg && (
                  <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: profileMsg.includes('success') ? '#10B981' : '#EF4444' }}>
                    {profileMsg}
                  </p>
                )}

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    type="submit" 
                    disabled={savingProfile}
                    style={{ 
                      background: 'linear-gradient(135deg, #C49746 0%, #B45309 100%)', 
                      color: '#ffffff', 
                      border: 'none', 
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '8px', 
                      fontSize: '0.9rem', 
                      fontWeight: 600, 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <Save size={16} /> {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>


            {/* System Configuration & Actions Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>System Configuration</h3>
                  <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.2rem' }}>Core application parameters</p>
                </div>
                <div style={{ padding: '0.5rem 0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4A5568', fontSize: '0.9rem', fontWeight: 600 }}>
                      <Server size={18} style={{ color: '#94A3B8' }} /> API Endpoint
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#161D2B', background: '#F1F5F9', padding: '0.25rem 0.75rem', borderRadius: '6px', fontFamily: 'monospace' }}>/api/v1</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4A5568', fontSize: '0.9rem', fontWeight: 600 }}>
                      <ShieldCheck size={18} style={{ color: '#94A3B8' }} /> Authentication
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#161D2B', fontWeight: 500 }}>Sanctum Tokens</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#4A5568', fontSize: '0.9rem', fontWeight: 600 }}>
                      <Globe size={18} style={{ color: '#94A3B8' }} /> Environment
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#047857', background: '#D1FAE5', padding: '0.25rem 0.75rem', borderRadius: '6px', fontWeight: 700, textTransform: 'uppercase' }}>Production</span>
                  </div>
                </div>
              </div>

              {/* Administrative Actions */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.02)',
                overflow: 'hidden'
              }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>Administrative Actions</h3>
                  <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.2rem' }}>Manage cache and performance</p>
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', background: '#FAF7F2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '10px', background: '#ffffff', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                        <RefreshCw size={22} className={clearingCache ? 'animate-spin' : ''} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>Clear System Cache</h4>
                        <p style={{ fontSize: '0.8rem', color: '#718096', margin: '0.1rem 0 0', maxWidth: '200px' }}>Flushes application cache, routes, and config.</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleClearCache} 
                      disabled={clearingCache}
                      style={{ background: '#0F172A', color: '#ffffff', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)' }}
                    >
                      {clearingCache ? 'Clearing...' : 'Clear Cache'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
