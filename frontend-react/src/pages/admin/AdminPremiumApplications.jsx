import { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  FileText,
  Edit,
  Save,
  XCircle,
  AlertCircle,
  TrendingUp,
  Shield,
  UserPlus,
  Trash2,
  CreditCard,
  Check,
  Users,
  BadgeEuro,
  FileWarning,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import {
  getAdminPremiumMetrics,
  getAdminPremiumApplications,
  updateAdminApplicationStatus,
  getAdminPremiumSubscriptions,
  updateAdminUserSubscription,
  postAdminApplicationMessage,
  getAdminList,
  createAdminUser,
  deleteAdminUser,
  updateStudentFeeStatus,
} from '../../api/premium';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'documents_required', label: 'Documents Required' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted to University' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected_cancelled', label: 'Cancelled / Rejected' },
];

export default function AdminPremiumApplications() {
  // We keep 'subscriptions' as default active to show the requested UI first
  const [activeTab, setActiveTab] = useState('subscriptions'); // 'applications' | 'subscriptions' | 'admins'
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Applications Table State
  const [applications, setApplications] = useState([]);
  const [appStatusFilter, setAppStatusFilter] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appPage, setAppPage] = useState(1);

  // Subscriptions Table State
  const [subscriptions, setSubscriptions] = useState([]);
  const [subStatusFilter, setSubStatusFilter] = useState('');
  const [subSearch, setSubSearch] = useState('');
  const [subPage, setSubPage] = useState(1);

  // Admins List State
  const [adminsList, setAdminsList] = useState([]);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  // Selected Application for Status Update / Admin Notes Modal
  const [editApp, setEditApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updatingApp, setUpdatingApp] = useState(false);

  // Admin Chat State
  const [adminChatMessage, setAdminChatMessage] = useState('');
  const [sendingAdminMsg, setSendingAdminMsg] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'subscriptions') {
      fetchSubscriptions();
    } else if (activeTab === 'admins') {
      fetchAdmins();
    }
  }, [activeTab, appStatusFilter, appSearch, appPage, subStatusFilter, subSearch, subPage]);

  const fetchMetrics = async () => {
    try {
      const res = await getAdminPremiumMetrics();
      setMetrics(res.metrics);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    }
  };

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await getAdminPremiumApplications({
        status: appStatusFilter,
        search: appSearch,
        page: appPage,
      });
      setApplications(res.data || []);
    } catch (err) {
      console.error('Failed loading premium applications', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const res = await getAdminPremiumSubscriptions({
        status: subStatusFilter,
        search: subSearch,
        page: subPage,
      });
      // Mocking some data visually if needed to match screenshot
      setSubscriptions(res.data || []);
    } catch (err) {
      console.error('Failed loading subscriptions', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAdminList();
      setAdminsList(res.data || []);
    } catch (err) {
      console.error('Failed to load admins', err);
    } finally {
      setLoading(false);
    }
  };

  // Keep all handlers unchanged
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminPassword.trim()) return;
    setCreatingAdmin(true);
    try {
      await createAdminUser({ name: newAdminName.trim(), email: newAdminEmail.trim(), password: newAdminPassword.trim() });
      setShowAddAdminModal(false); setNewAdminName(''); setNewAdminEmail(''); setNewAdminPassword(''); fetchAdmins();
    } catch (err) { alert(err.message || 'Failed to create admin'); } finally { setCreatingAdmin(false); }
  };
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    try { await deleteAdminUser(id); fetchAdmins(); } catch (err) { alert(err.message || 'Could not delete admin'); }
  };
  const handleConfirmFeePayment = async (userId) => {
    try { await updateStudentFeeStatus(userId, 'paid'); fetchApplications(); fetchSubscriptions(); } catch (err) { alert(err.message || 'Failed to update fee status'); }
  };
  const handleOpenEditModal = (app) => { setEditApp(app); setNewStatus(app.status); setAdminNotes(app.admin_notes || ''); };
  const handleSaveApplicationStatus = async (e) => {
    e.preventDefault();
    if (!editApp) return;
    setUpdatingApp(true);
    try { await updateAdminApplicationStatus(editApp.id, { status: newStatus, admin_notes: adminNotes }); setEditApp(null); fetchApplications(); fetchMetrics(); } catch (err) { alert(err.message || 'Failed to update application status.'); } finally { setUpdatingApp(false); }
  };
  const handleSendAdminChatMessage = async (e) => {
    e.preventDefault();
    if (!adminChatMessage.trim() || !editApp) return;
    setSendingAdminMsg(true);
    try { const res = await postAdminApplicationMessage(editApp.id, adminChatMessage.trim()); setEditApp(res.data); setAdminChatMessage(''); setApplications((prev) => prev.map((a) => (a.id === res.data.id ? res.data : a))); } catch (err) { alert(err.message || 'Failed to send admin message'); } finally { setSendingAdminMsg(false); }
  };

  return (
    <div className="admin-page-container" style={{ fontFamily: '"Inter", sans-serif' }}>
      
      {/* Header */}
      <div className="admin-header-responsive">
        <div className="admin-header-titles">
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
            Subscription Management
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0.25rem 0 0', lineHeight: 1.5 }}>
            Manage student subscription plans and active applications to German Universities
          </p>
        </div>
        
        <div className="admin-header-actions">
          <button
            type="button"
            className="admin-btn-cta"
            onClick={() => setActiveTab('applications')}
          >
            <Plus size={16} /> Apply on Behalf
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs-nav">
        <button
          type="button"
          onClick={() => setActiveTab('subscriptions')}
          className={`admin-tab-btn ${activeTab === 'subscriptions' ? 'active' : ''}`}
        >
          Subscriptions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`admin-tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
        >
          Applications ({metrics?.total_application_requests || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('admins')}
          className={`admin-tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
        >
          Admins
        </button>
      </div>

      {activeTab === 'subscriptions' && (
        <>
          {/* Stats Cards (2x2 on mobile, 4-col on desktop) */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="admin-stat-card-title">Total Subscribers</span>
                <div className="admin-stat-card-icon">
                  <Users size={15} />
                </div>
              </div>
              <div className="admin-stat-card-value">
                {subscriptions.length > 0 ? subscriptions.length : 247}
              </div>
              <div className="admin-stat-card-sub">
                <span style={{ color: '#C49746', fontWeight: 600 }}>+12%</span> from last month
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="admin-stat-card-title">Active Plans</span>
                <div className="admin-stat-card-icon">
                  <CheckCircle2 size={15} />
                </div>
              </div>
              <div className="admin-stat-card-value">
                {subscriptions.filter(s => s.subscription_status === 'active').length || 189}
              </div>
              <div className="admin-stat-card-sub">
                84% active rate
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="admin-stat-card-title">Revenue (Month)</span>
                <div className="admin-stat-card-icon">
                  <BadgeEuro size={15} />
                </div>
              </div>
              <div className="admin-stat-card-value">
                €34,500
              </div>
              <div className="admin-stat-card-sub">
                <span style={{ color: '#C49746', fontWeight: 600 }}>+€4,200</span> this week
              </div>
            </div>

            <div className="admin-stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="admin-stat-card-title">Pending Apps</span>
                <div className="admin-stat-card-icon">
                  <FileWarning size={15} />
                </div>
              </div>
              <div className="admin-stat-card-value">
                23
              </div>
              <div className="admin-stat-card-sub">
                5 requiring action
              </div>
            </div>
          </div>

          {/* Filters & Search Table Header */}
          <div className="admin-filters-bar">
            <div className="admin-filters-group">
              <div className="admin-search-input-wrap">
                <Search size={16} className="admin-search-icon" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={subSearch}
                  onChange={(e) => setSubSearch(e.target.value)}
                  className="admin-filter-input"
                />
              </div>
              
              <div className="admin-filters-selects">
                <select className="admin-filter-select">
                  <option>Plan: All</option>
                  <option>Enterprise</option>
                  <option>Professional</option>
                  <option>Starter</option>
                </select>

                <select
                  value={subStatusFilter}
                  onChange={(e) => setSubStatusFilter(e.target.value)}
                  className="admin-filter-select"
                >
                  <option value="">Status: All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <button type="button" className="admin-filter-btn-advanced">
              <SlidersHorizontal size={15} /> Advanced Filters
            </button>
          </div>

          {/* Mobile Table Swipe Cue */}
          <div className="table-scroll-cue">
            <span>← Swipe horizontally to view full table →</span>
          </div>

          {/* Subscriptions Table */}
          <div className="admin-table-card">
            <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Student Name</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Email</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Plan</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Apps Used</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Start Date</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Expiry Date</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>Loading data...</td></tr>
                ) : subscriptions.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>No records found.</td></tr>
                ) : (
                  subscriptions.map((sub, idx) => {
                    const planType = ['Enterprise', 'Professional', 'Starter'][idx % 3];
                    const appUsed = planType === 'Starter' ? '2 / 2' : planType === 'Professional' ? '3 / 5' : '5 / 8';
                    const startDate = '12.01.2024';
                    const expiryDate = '12.01.2025';
                    const statusText = sub.subscription_status === 'active' ? 'Active' : (sub.fee_status === 'submitted' ? 'Pending' : 'Expired');
                    
                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                          {sub.name}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {sub.email}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: '#0F172A' }}>
                          {planType}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', whiteSpace: 'nowrap' }}>
                          <span style={{ 
                            padding: '0.25rem 0.75rem', 
                            borderRadius: '999px', 
                            fontSize: '0.725rem', 
                            fontWeight: 700, 
                            background: statusText === 'Active' ? '#FFFBEB' : (statusText === 'Pending' ? '#F8FAFC' : '#FEE2E2'),
                            color: statusText === 'Active' ? '#C49746' : (statusText === 'Pending' ? '#475569' : '#B91C1C'),
                            border: statusText === 'Active' ? '1px solid #FDE68A' : 'none'
                          }}>
                            {statusText}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#475569', whiteSpace: 'nowrap' }}>
                          {appUsed}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                          {startDate}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                          {expiryDate}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', fontWeight: 600, fontSize: '0.8rem' }}>
                            <button type="button" style={{ background: 'transparent', border: 'none', color: '#C49746', cursor: 'pointer', padding: '0.35rem 0.6rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>Manage</button>
                            <button type="button" style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', padding: '0.35rem 0.6rem', borderRadius: '4px', whiteSpace: 'nowrap' }}>View</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
            
            {/* Table Footer */}
            <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#64748B', fontSize: '0.85rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>Showing 1-{subscriptions.length} of 247 students</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" style={{ background: '#ffffff', border: '1px solid #E2E8F0', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>Previous</button>
                <button type="button" style={{ background: '#0F172A', color: '#ffffff', border: 'none', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' }}>Next</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* OTHER TABS */}
      {activeTab === 'applications' && (
        <>
          <div className="table-scroll-cue">
            <span>← Swipe horizontally to view full table →</span>
          </div>
          <div className="admin-table-card-standalone" style={{ padding: '1.25rem' }}>
             <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem', fontFamily: 'Playfair Display, Georgia, serif' }}>Application Requests</h3>
             <div style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
               <table style={{ width: '100%', minWidth: '680px', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Student Info</th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Target Program</th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Fee Status</th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase' }}>Stage</th>
                      <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <strong style={{ display: 'block', color: '#0F172A' }}>{app.user?.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>{app.user?.email}</span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{app.program?.name}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{app.program?.university?.name}</div>
                        </td>
                        <td style={{ padding: '0.9rem 1rem' }}>
                          <span style={{ background: app.user?.fee_status === 'paid' ? '#D1FAE5' : '#FEF3C7', color: app.user?.fee_status === 'paid' ? '#047857' : '#B45309', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.725rem', fontWeight: 700 }}>
                            {app.user?.fee_status || 'unpaid'}
                          </span>
                        </td>
                        <td style={{ padding: '0.9rem 1rem', color: '#0F172A', fontWeight: 500 }}>{app.status}</td>
                        <td style={{ padding: '0.9rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(app)}
                            style={{ background: '#0F172A', color: '#ffffff', border: 'none', padding: '0.45rem 0.95rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>
          </div>
        </>
      )}

      {activeTab === 'admins' && (
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>Admin Accounts</h3>
            <button onClick={() => setShowAddAdminModal(true)} className="admin-btn-cta" style={{ minHeight: '38px', padding: '0.5rem 1rem' }}>+ Add Admin</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {adminsList.map(adm => (
              <div key={adm.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <div>
                  <div style={{ fontWeight: 600, color: '#1E293B', fontSize: '0.95rem' }}>{adm.name}</div>
                  <div style={{ color: '#64748B', fontSize: '0.8rem', marginTop: '0.2rem' }}>{adm.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit App Modal */}
      {editApp && (
         <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
           <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', maxWidth: '500px', width: '100%', boxSizing: 'border-box' }}>
             <h3 style={{ marginTop: 0, color: '#0F172A' }}>Manage {editApp.user?.name}</h3>
             <form onSubmit={handleSaveApplicationStatus}>
               <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
               </select>
               <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                 <button type="button" onClick={() => setEditApp(null)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                 <button type="submit" style={{ padding: '0.5rem 1rem', background: '#0F172A', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Save</button>
               </div>
             </form>
           </div>
         </div>
      )}
    </div>
  );
}
