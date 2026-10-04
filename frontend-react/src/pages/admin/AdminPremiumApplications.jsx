import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Search,
  Filter,
  Clock,
  UserCheck,
  Building2,
  FileText,
  Edit,
  Save,
  XCircle,
  AlertCircle,
  Shield,
  UserPlus,
  Trash2,
  Check,
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
  createAdminPremiumApplication,
} from '../../api/premium';
import { fetchAdminPrograms } from '../../api/admin';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'payment_requested', label: 'Payment Requested (Send challan)' },
  { value: 'payment_received', label: 'Payment Received (Activate Premium)' },
  { value: 'documents_required', label: 'Documents Required' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'submitted', label: 'Submitted to University' },
  { value: 'completed', label: 'Completed' },
  { value: 'rejected_cancelled', label: 'Cancelled / Rejected' },
];

export default function AdminPremiumApplications() {
  const [searchParams] = useSearchParams();
  const requestedTab = searchParams.get('tab');
  // We keep 'subscriptions' as default active to show the requested UI first
  const [activeTab, setActiveTab] = useState(requestedTab === 'applications' ? 'applications' : 'subscriptions'); // 'applications' | 'subscriptions' | 'admins'
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

  const [showCreateApplicationModal, setShowCreateApplicationModal] = useState(false);
  const [onBehalfStudents, setOnBehalfStudents] = useState([]);
  const [onBehalfPrograms, setOnBehalfPrograms] = useState([]);
  const [onBehalfStudentId, setOnBehalfStudentId] = useState('');
  const [onBehalfProgramId, setOnBehalfProgramId] = useState('');
  const [onBehalfNotes, setOnBehalfNotes] = useState('');
  const [onBehalfError, setOnBehalfError] = useState('');
  const [loadingOnBehalfOptions, setLoadingOnBehalfOptions] = useState(false);
  const [creatingOnBehalf, setCreatingOnBehalf] = useState(false);

  // Selected Application for Status Update / Admin Notes Modal
  const [editApp, setEditApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState('');
  const [editPrograms, setEditPrograms] = useState([]);
  const [loadingEditPrograms, setLoadingEditPrograms] = useState(false);
  const [updatingApp, setUpdatingApp] = useState(false);

  // Admin Chat State
  const [adminChatMessage, setAdminChatMessage] = useState('');
  const [sendingAdminMsg, setSendingAdminMsg] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  useEffect(() => {
    if (requestedTab === 'applications') {
      setActiveTab('applications');
    }
  }, [requestedTab]);

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
  const handleOpenCreateApplication = async () => {
    setShowCreateApplicationModal(true);
    setOnBehalfError('');
    setOnBehalfStudentId('');
    setOnBehalfProgramId('');
    setOnBehalfNotes('');
    setLoadingOnBehalfOptions(true);
    try {
      const [studentsResponse, programsResponse] = await Promise.all([
        getAdminPremiumSubscriptions({ per_page: 100 }),
        fetchAdminPrograms({ per_page: 100 }),
      ]);
      setOnBehalfStudents(studentsResponse.data || []);
      setOnBehalfPrograms(programsResponse.data || []);
    } catch (err) {
      setOnBehalfError(err.message || 'Could not load students and programs.');
    } finally {
      setLoadingOnBehalfOptions(false);
    }
  };
  const handleCreateApplicationOnBehalf = async (e) => {
    e.preventDefault();
    if (!onBehalfStudentId || !onBehalfProgramId) {
      setOnBehalfError('Select both a student and a target program.');
      return;
    }
    setCreatingOnBehalf(true);
    setOnBehalfError('');
    try {
      await createAdminPremiumApplication({
        user_id: Number(onBehalfStudentId),
        program_id: Number(onBehalfProgramId),
        student_notes: onBehalfNotes.trim() || null,
      });
      setShowCreateApplicationModal(false);
      setActiveTab('applications');
      fetchApplications();
      fetchMetrics();
    } catch (err) {
      setOnBehalfError(err.message || 'Could not create the application request.');
    } finally {
      setCreatingOnBehalf(false);
    }
  };
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to remove this admin?')) return;
    try { await deleteAdminUser(id); fetchAdmins(); } catch (err) { alert(err.message || 'Could not delete admin'); }
  };
  const handleConfirmFeePayment = async (userId) => {
    try { await updateStudentFeeStatus(userId, 'paid'); fetchApplications(); fetchSubscriptions(); } catch (err) { alert(err.message || 'Failed to update fee status'); }
  };
  const handleOpenEditModal = async (app) => {
    setEditApp(app);
    setNewStatus(app.status);
    setAdminNotes(app.admin_notes || '');
    setSelectedProgramId(app.program_id?.toString() || '');
    setLoadingEditPrograms(true);

    try {
      const response = await fetchAdminPrograms({ per_page: 100 });
      setEditPrograms(response.data || []);
    } catch (err) {
      alert(err.message || 'Could not load programs for assignment.');
    } finally {
      setLoadingEditPrograms(false);
    }
  };
  const handleSaveApplicationStatus = async (e) => {
    e.preventDefault();
    if (!editApp) return;
    if (newStatus !== 'pending' && !selectedProgramId) {
      alert('Select a suitable program before moving this request beyond Pending Review.');
      return;
    }
    setUpdatingApp(true);
    try { await updateAdminApplicationStatus(editApp.id, { status: newStatus, admin_notes: adminNotes, program_id: selectedProgramId ? Number(selectedProgramId) : null }); setEditApp(null); fetchApplications(); fetchMetrics(); } catch (err) { alert(err.message || 'Failed to update application status.'); } finally { setUpdatingApp(false); }
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
            onClick={handleOpenCreateApplication}
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
          {/* Search and real status filter */}
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
          </div>

          {/* Subscriptions Table */}
          <div className="admin-table-card admin-subscription-table">
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Student Name</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Plan</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Start Date</th>
                  <th style={{ padding: '0.85rem 1.25rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', fontSize: '0.725rem', letterSpacing: '0.05em' }}>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>Loading data...</td></tr>
                ) : subscriptions.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748B' }}>No records found.</td></tr>
                ) : (
                  subscriptions.map((sub, idx) => {
                    const planType = sub.subscription_plan || 'Premium application';
                    const startDate = sub.subscription_started_at ? new Date(sub.subscription_started_at).toLocaleDateString() : 'Not started';
                    const expiryDate = sub.subscription_expires_at ? new Date(sub.subscription_expires_at).toLocaleDateString() : 'No expiry';
                    const statusText = sub.subscription_status === 'active' ? 'Active' : (sub.fee_status === 'submitted' ? 'Pending' : 'Expired');
                    
                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                        <td style={{ padding: '0.9rem 1.25rem', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap' }}>
                          {sub.name}
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
                        <td style={{ padding: '0.9rem 1.25rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                          {startDate}
                        </td>
                        <td style={{ padding: '0.9rem 1.25rem', color: '#64748B', whiteSpace: 'nowrap' }}>
                          {expiryDate}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
            
          </div>
          <div className="admin-subscription-mobile-list">
            {loading ? (
              <p className="admin-mobile-empty">Loading subscriptions...</p>
            ) : subscriptions.length === 0 ? (
              <p className="admin-mobile-empty">No subscriptions found.</p>
            ) : subscriptions.map((sub) => {
              const statusText = sub.subscription_status === 'active' ? 'Active' : (sub.fee_status === 'submitted' ? 'Pending' : 'Inactive');
              return (
                <article className="admin-subscription-mobile-card" key={sub.id}>
                  <div>
                    <strong>{sub.name}</strong>
                    <small>{sub.email}</small>
                  </div>
                  <span className={`admin-subscription-status admin-subscription-status--${statusText.toLowerCase()}`}>{statusText}</span>
                  <p>{sub.subscription_plan || 'Premium application'}</p>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* OTHER TABS */}
      {activeTab === 'applications' && (
        <>
          <div className="table-scroll-cue admin-application-table-cue">
            <span>← Swipe horizontally to view full table →</span>
          </div>
          <div className="admin-table-card-standalone admin-application-table" style={{ padding: '1.25rem' }}>
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
                          <div style={{ fontWeight: 600, color: '#0F172A' }}>{app.program?.name || 'Awaiting advisor assignment'}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{app.program?.university?.name || `Requested field: ${app.requested_field || 'Not specified'}`}</div>
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
          <div className="admin-application-mobile-list">
            <h3>Application Requests</h3>
            {applications.map((app) => (
              <article className="admin-application-mobile-card" key={app.id}>
                <div className="admin-application-mobile-card__student">
                  <div>
                    <span className="admin-application-mobile-card__label">Student</span>
                    <strong>{app.user?.name || 'Student'}</strong>
                    <small>{app.user?.email}</small>
                  </div>
                  <span className={`admin-application-status admin-application-status--${app.user?.fee_status === 'paid' ? 'paid' : 'unpaid'}`}>
                    {app.user?.fee_status || 'unpaid'}
                  </span>
                </div>
                <div className="admin-application-mobile-card__program">
                  <span className="admin-application-mobile-card__label">Target program</span>
                  <strong>{app.program?.name || 'Awaiting advisor assignment'}</strong>
                  <small>{app.program?.university?.name || `Requested field: ${app.requested_field || 'Not specified'}`}</small>
                </div>
                <div className="admin-application-mobile-card__footer">
                  <span className="admin-application-stage">{(app.status || 'pending').replaceAll('_', ' ')}</span>
                  <button type="button" onClick={() => handleOpenEditModal(app)}>Manage</button>
                </div>
              </article>
            ))}
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

      {showCreateApplicationModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15, 23, 42, 0.58)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', maxWidth: '520px', width: '100%', maxHeight: 'calc(100dvh - 2rem)', overflowY: 'auto', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, color: '#0F172A', fontFamily: 'Playfair Display, Georgia, serif' }}>Apply on behalf of a student</h3>
                <p style={{ margin: '0.35rem 0 0', color: '#64748B', fontSize: '0.825rem', lineHeight: 1.5 }}>The student will receive a notification when their request is created.</p>
              </div>
              <button type="button" onClick={() => setShowCreateApplicationModal(false)} aria-label="Close application form" title="Close" style={{ border: 0, background: 'transparent', color: '#64748B', cursor: 'pointer', padding: '0.25rem' }}><XCircle size={20} /></button>
            </div>
            <form onSubmit={handleCreateApplicationOnBehalf} style={{ display: 'grid', gap: '1rem' }}>
              <label className="field">
                <span className="field-label">Student *</span>
                <select className="input select" value={onBehalfStudentId} onChange={(e) => setOnBehalfStudentId(e.target.value)} disabled={loadingOnBehalfOptions}>
                  <option value="">{loadingOnBehalfOptions ? 'Loading students...' : 'Select a student'}</option>
                  {onBehalfStudents.map((student) => <option key={student.id} value={student.id}>{student.name} ({student.email})</option>)}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Target program *</span>
                <select className="input select" value={onBehalfProgramId} onChange={(e) => setOnBehalfProgramId(e.target.value)} disabled={loadingOnBehalfOptions}>
                  <option value="">{loadingOnBehalfOptions ? 'Loading programs...' : 'Select a program'}</option>
                  {onBehalfPrograms.map((program) => <option key={program.id} value={program.id}>{program.name}{program.university?.name ? ` - ${program.university.name}` : ''}</option>)}
                </select>
              </label>
              <label className="field">
                <span className="field-label">Notes for the student</span>
                <textarea className="input" rows="4" value={onBehalfNotes} onChange={(e) => setOnBehalfNotes(e.target.value)} placeholder="Optional instructions or context" />
              </label>
              {onBehalfError && <p style={{ margin: 0, color: '#B42318', fontSize: '0.825rem' }}>{onBehalfError}</p>}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => setShowCreateApplicationModal(false)} disabled={creatingOnBehalf} style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={creatingOnBehalf || loadingOnBehalfOptions} style={{ padding: '0.6rem 1rem', borderRadius: '6px', border: 'none', background: '#0F172A', color: '#fff', cursor: 'pointer', fontWeight: 700 }}>{creatingOnBehalf ? 'Creating...' : 'Create request'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit App Modal */}
      {editApp && (
         <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
           <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', maxWidth: '500px', width: '100%', boxSizing: 'border-box' }}>
             <h3 style={{ marginTop: 0, color: '#0F172A' }}>Manage {editApp.user?.name}</h3>
             <form onSubmit={handleSaveApplicationStatus}>
               <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '0.85rem 1rem', marginBottom: '1rem' }}>
                 <div style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Student requested field</div>
                 <div style={{ color: '#0F172A', fontWeight: 700, marginTop: '0.3rem' }}>{editApp.requested_field || 'Not specified'}</div>
               </div>
               <label style={{ display: 'block', color: '#334155', fontSize: '0.825rem', fontWeight: 700, marginBottom: '0.4rem' }}>Assign suitable program {newStatus !== 'pending' ? '*' : ''}</label>
               <select value={selectedProgramId} onChange={(e) => setSelectedProgramId(e.target.value)} disabled={loadingEditPrograms} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#fff' }}>
                 <option value="">{loadingEditPrograms ? 'Loading programs...' : 'Select a program for this student'}</option>
                 {editPrograms.map((program) => <option key={program.id} value={program.id}>{program.name}{program.university?.name ? ` - ${program.university.name}` : ''}</option>)}
               </select>
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
