import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Plus,
  Building2,
  ArrowRight,
  ShieldCheck,
  Send,
  ChevronRight,
  Upload,
  UserCheck,
  Info,
  BadgeCheck,
  X,
  ExternalLink,
  MessageSquare,
  FolderLock,
  FileCheck,
  Award,
  BookOpen,
  Globe,
  User,
  Trash2,
  CreditCard,
  AlertTriangle,
  Check,
  UploadCloud,
  Lock,
  Printer,
  GraduationCap,
  Lightbulb,
  MapPin,
} from 'lucide-react';
import {
  getStudentPremiumStatus,
  getStudentPremiumApplications,
  createStudentPremiumApplication,
  postStudentApplicationMessage,
  getStudentVault,
  updateStudentVault,
  getStudentPaymentStatus,
  submitStudentPayment,
} from '../../api/premium';
import { fetchShortlist, fetchPrograms } from '../../api/student';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: '#B45309', bg: '#FEF3C7', step: 1 },
  under_review: { label: 'Under Review', color: '#1D4ED8', bg: '#DBEAFE', step: 2 },
  documents_required: { label: 'Documents Required', color: '#C2410C', bg: '#FFEDD5', step: 2 },
  in_progress: { label: 'In Progress', color: '#6D28D9', bg: '#EDE9FE', step: 3 },
  submitted: { label: 'Submitted to Uni', color: '#047857', bg: '#D1FAE5', step: 4 },
  completed: { label: 'Completed', color: '#047857', bg: '#D1FAE5', step: 4 },
  rejected_cancelled: { label: 'Cancelled', color: '#B91C1C', bg: '#FEE2E2', step: 0 },
};

const ACADEMIC_FIELDS = [
  { id: 'field_cs', label: 'Computer Science & Software Engineering', name: 'Computer Science & Software Engineering' },
  { id: 'field_it', label: 'Information Technology (IT) & Data Science', name: 'Information Technology & Data Science' },
  { id: 'field_ai', label: 'Artificial Intelligence & Robotics', name: 'Artificial Intelligence & Robotics' },
  { id: 'field_biz', label: 'Business Administration & Management (MBA/BBA)', name: 'Business Administration & Management' },
  { id: 'field_eng', label: 'Engineering (Mechanical, Electrical, Civil)', name: 'Engineering & Technology' },
  { id: 'field_sci', label: 'Natural Sciences (Physics, Chemistry, Biology)', name: 'Natural Sciences' },
  { id: 'field_med', label: 'Medicine & Healthcare Sciences', name: 'Medicine & Healthcare Sciences' },
  { id: 'field_eco', label: 'Economics, Finance & Accounting', name: 'Economics & Finance' },
  { id: 'field_other', label: 'Other Field / Specialization (Mention in description below)', name: 'Other Field / Specialization' },
];

const VAULT_CATEGORIES = [
  { key: 'cv', label: 'Curriculum Vitae (CV / Resume)', desc: 'Europass or German standard format PDF', icon: FileText, required: true },
  { key: 'bachelor_degree', label: "Bachelor's Degree Certificate", desc: 'Official degree completion certificate / provisional degree', icon: Award, required: true },
  { key: 'bachelor_transcript', label: "Bachelor's Academic Transcript", desc: 'Official semester marksheets / transcripts showing all credits & CGPA', icon: BookOpen, required: true },
  { key: 'master_degree', label: "Master's Degree & Transcript (If Done)", desc: 'Degree certificate & transcripts if you already completed a master degree', icon: BookOpen, required: false },
  { key: 'cnic', label: 'CNIC / National Identity Card', desc: 'National ID card (Front & Back scanned PDF or image)', icon: User, required: true },
  { key: 'ielts', label: 'IELTS / TOEFL / Language Test Scorecard', desc: 'Official English or German language test result sheet (IELTS, TOEFL, Goethe, TestDaF)', icon: Globe, required: true },
  { key: 'passport', label: 'Passport (Validity & Bio Pages)', desc: 'Passport first 2 pages & signature page scan', icon: ShieldCheck, required: true },
  { key: 'motivation_letter', label: 'Motivation Letter / SOP & LORs', desc: 'Statement of purpose & recommendation letters from professors/employers', icon: FileCheck, required: false },
  { key: 'other', label: 'Other Supporting Documents', desc: 'Work experience certificates, internship letters, or publications', icon: UploadCloud, required: false },
];

function ApplyForMeIllustration() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
      <img
        src="/images/apply_for_me_illustration.jpg"
        alt="University Application Illustration"
        style={{
          width: '100%',
          height: 'auto',
          maxWidth: '360px',
          objectFit: 'contain',
          filter: 'drop-shadow(0 10px 25px rgba(15, 23, 42, 0.08))',
          borderRadius: '16px',
        }}
      />
    </div>
  );
}

export default function ApplyForMePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'vault'
  const [loading, setLoading] = useState(true);
  const [premiumStatus, setPremiumStatus] = useState('free');
  const [feeStatus, setFeeStatus] = useState('unpaid'); // 'unpaid' | 'submitted' | 'paid'
  const [applications, setApplications] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [systemPrograms, setSystemPrograms] = useState([]);

  // PRO Vault State
  const [vaultData, setVaultData] = useState({});
  const [savingVault, setSavingVault] = useState(false);
  const [vaultMsg, setVaultMsg] = useState('');

  // New Application Request Modal State
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [studentNotes, setStudentNotes] = useState('');
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appError, setAppError] = useState('');
  
  // Custom Modals / Messages
  const [showReqSuccessModal, setShowReqSuccessModal] = useState(false);
  const [showDocsSubmittedModal, setShowDocsSubmittedModal] = useState(false);

  // Selected Application Detail & Chat Modal
  const [detailApp, setDetailApp] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);

  // Manual Payment Upload State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  useEffect(() => {
    loadData().then((apps) => {
      if (apps && apps.length > 0) {
        const searchParams = new URLSearchParams(location.search);
        const appId = searchParams.get('app_id');
        if (appId) {
          const found = apps.find(a => a.id.toString() === appId.toString());
          if (found) {
            setDetailApp(found);
          }
        }
      }
    });
    if (location.state?.openModal) {
      setShowApplyModal(true);
    }
  }, [location.state, location.search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statusRes, appsRes, shortlistRes, vaultRes, paymentRes, progsRes] = await Promise.all([
        getStudentPremiumStatus().catch(() => ({ subscription_status: 'free' })),
        getStudentPremiumApplications().catch(() => ({ data: [] })),
        fetchShortlist().catch(() => ({ data: [] })),
        getStudentVault().catch(() => ({ data: {} })),
        getStudentPaymentStatus().catch(() => ({ fee_status: 'unpaid' })),
        fetchPrograms(50).catch(() => ({ data: [] })),
      ]);

      setPremiumStatus(statusRes.subscription_status || 'free');
      setFeeStatus(paymentRes.fee_status || 'unpaid');
      setApplications(appsRes.data || []);
      setShortlist(shortlistRes.data || []);
      setVaultData(vaultRes.data || {});
      setSystemPrograms(progsRes.data || progsRes.data?.data || []);
      
      return appsRes.data || [];
    } catch (err) {
      console.error('Failed loading premium application data', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Local System File Picker Handler for Document Vault
  const handleLocalFileSelect = (catKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64Data = uploadEvent.target.result;
      setVaultData((prev) => ({
        ...prev,
        [catKey]: {
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          url: base64Data,
          uploaded_at: new Date().toISOString(),
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveVaultFile = (catKey) => {
    setVaultData((prev) => {
      const copy = { ...prev };
      delete copy[catKey];
      return copy;
    });
  };

  const handleSaveVault = async () => {
    setSavingVault(true);
    setVaultMsg('');
    try {
      await updateStudentVault(vaultData);
      setVaultMsg('Documents saved in PRO Vault.');
      setShowDocsSubmittedModal(true);
    } catch (err) {
      alert(err.message || 'Failed to save vault');
    } finally {
      setSavingVault(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    if (!selectedTarget) {
      setAppError('Please select your target program or field of study.');
      return;
    }

    setSubmittingApp(true);
    setAppError('');

    let realProgramId = null;
    let extraNotes = studentNotes;

    // Check if user selected an academic field
    const matchedField = ACADEMIC_FIELDS.find((f) => f.id === selectedTarget);
    if (matchedField) {
      extraNotes = `Target Field: ${matchedField.name}${studentNotes ? `\n\nNotes: ${studentNotes}` : ''}`;
      // Pick first program from shortlist or system programs as program reference
      if (shortlist.length > 0) {
        realProgramId = shortlist[0].program?.id || shortlist[0].program_id;
      } else if (systemPrograms.length > 0) {
        realProgramId = systemPrograms[0].id;
      } else {
        realProgramId = 1;
      }
    } else {
      realProgramId = Number(selectedTarget);
    }

    try {
      await createStudentPremiumApplication({
        program_id: realProgramId,
        student_notes: extraNotes,
        documents: [],
      });

      setShowApplyModal(false);
      setSelectedTarget('');
      setStudentNotes('');
      setShowReqSuccessModal(true);
      loadData();
    } catch (err) {
      setAppError(err.message || 'Could not submit application request.');
    } finally {
      setSubmittingApp(false);
    }
  };

  const handleScreenshotSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setPaymentScreenshot({
        name: file.name,
        url: uploadEvent.target.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleProcessManualPayment = async (e) => {
    e.preventDefault();
    if (!transactionId || !paymentScreenshot) {
      alert("Please provide both Transaction ID and a payment screenshot.");
      return;
    }
    setProcessingPayment(true);

    try {
      await submitStudentPayment({
        payment_reference: transactionId,
        payment_proof: paymentScreenshot.url,
      });

      setFeeStatus('submitted');
      setProcessingPayment(false);
      setShowPaymentModal(false);
      setReceiptData({
        trx_id: transactionId,
        screenshot_attached: true,
        amount: 'PKR 45,000',
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        status: 'SUBMITTED FOR VERIFICATION',
      });
    } catch (err) {
      alert(err.message || 'Payment submission failed');
      setProcessingPayment(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !detailApp) return;

    setSendingMsg(true);
    try {
      const res = await postStudentApplicationMessage(detailApp.id, chatMessage.trim());
      setDetailApp(res.data);
      setChatMessage('');
      setApplications((prev) => prev.map((a) => (a.id === res.data.id ? res.data : a)));
    } catch (err) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSendingMsg(false);
    }
  };

  const uploadedDocsCount = Object.keys(vaultData).length;

  return (
    <div style={{ padding: '0.75rem 0.5rem', maxWidth: '1240px', margin: '0 auto', color: '#161D2B' }}>
      
      {/* EXECUTIVE NAVY BLUE & ROYAL GOLD HERO BANNER */}
      <div className="apply-for-me-hero">
        <div className="apply-for-me-hero-inner">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.95rem',
              borderRadius: '999px',
              background: 'rgba(196, 151, 70, 0.15)',
              border: '1px solid rgba(196, 151, 70, 0.4)',
              color: '#C49746',
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              marginBottom: '1.15rem',
            }}
          >
            <Sparkles size={15} /> GERMAN ADMISSIONS ASSISTANCE
          </div>

          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: 700,
              lineHeight: 1.2,
              color: '#ffffff',
              marginBottom: '0.85rem',
              letterSpacing: '-0.01em',
            }}
          >
            Let Our Experts Handle Your German University Applications
          </h1>

          <p style={{ fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.88)', lineHeight: 1.7, maxWidth: '680px' }}>
            Choose your target field of study or specific program. Our dedicated education consultants verify your transcripts, format your documents for German standards, manage application deadlines, and submit directly on your behalf.
          </p>

          <div style={{ marginTop: '1.75rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              style={{
                background: 'linear-gradient(135deg, #C49746 0%, #B45309 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '0.85rem 1.85rem',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '0.925rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                boxShadow: '0 8px 24px rgba(196, 151, 70, 0.35)',
                transition: 'transform 150ms ease, box-shadow 150ms ease',
              }}
            >
              <Send size={18} /> Initiate Application Request
            </button>
          </div>

          {/* Executive Trust Badges */}
          <div className="apply-for-me-trust-grid">
            <div className="apply-for-me-trust-item">
              <div className="apply-for-me-trust-icon"><ShieldCheck size={16} /></div>
              <span>uni-assist & Direct Submission</span>
            </div>
            <div className="apply-for-me-trust-item">
              <div className="apply-for-me-trust-icon"><Award size={16} /></div>
              <span>Bavarian Formula Conversion</span>
            </div>
            <div className="apply-for-me-trust-item">
              <div className="apply-for-me-trust-icon"><FileCheck size={16} /></div>
              <span>Certified German Document Check</span>
            </div>
            <div className="apply-for-me-trust-item">
              <div className="apply-for-me-trust-icon"><UserCheck size={16} /></div>
              <span>1-on-1 Dedicated Advisor Chat</span>
            </div>
          </div>
        </div>

        {/* Ambient Watermark Icon */}
        <div
          style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-30px',
            opacity: 0.05,
            pointerEvents: 'none',
            color: '#FFFFFF',
          }}
        >
          <Building2 size={320} />
        </div>
      </div>

      {/* SEGMENTED TAB SELECTORS */}
      <div className="apply-for-me-segmented-nav">
        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`apply-for-me-seg-btn ${activeTab === 'applications' ? 'active' : ''}`}
        >
          <FileText size={16} />
          <span>Application Requests</span>
          <span className="apply-for-me-seg-badge">{applications.length} Active</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('vault')}
          className={`apply-for-me-seg-btn ${activeTab === 'vault' ? 'active' : ''}`}
        >
          <FolderLock size={16} />
          <span>PRO Document Vault</span>
          <span className="apply-for-me-seg-badge">{uploadedDocsCount}/9 Ready</span>
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div>
        
        {/* TAB 1: APPLICATION REQUESTS */}
        {activeTab === 'applications' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Your Application Requests & Live Communication
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem', margin: 0 }}>
                  Track milestone stages, document verification, and live chat directly with your assigned German education consultant.
                </p>
              </div>

              <span
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0F172A',
                }}
              >
                {applications.length} Active Requests
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748B', background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                Loading application requests...
              </div>
            ) : applications.length === 0 ? (
              <div
                style={{
                  background: '#FFFFFF',
                  border: '2px dashed #CBD5E1',
                  borderRadius: '16px',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    background: '#F8FAFC',
                    border: '1px solid rgba(196, 151, 70, 0.4)',
                    color: '#C49746',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                >
                  <FileText size={26} />
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  No Application Requests Yet
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: '460px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                  Click below to initiate your application request. Select your desired field of study (Computer Science, Business, IT, Engineering, etc.) and let our consultancy team manage the rest.
                </p>
                <button
                  type="button"
                  onClick={() => setShowApplyModal(true)}
                  style={{
                    background: '#0F172A',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.6rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                    transition: 'all 180ms ease',
                  }}
                >
                  <Plus size={16} /> Initiate Application Request
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {applications.map((app) => {
                  const conf = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                  const msgCount = app.messages?.length || 0;
                  return (
                    <div
                      key={app.id}
                      className="apply-request-card"
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background: '#F8FAFC',
                              border: '1px solid #E2E8F0',
                              color: '#0F172A',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Building2 size={24} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', margin: 0, lineHeight: 1.25 }}>
                              {app.program?.name || app.student_notes?.split('\n')?.[0] || 'University Application'}
                            </h3>
                            <div style={{ fontSize: '0.825rem', color: '#64748B', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <MapPin size={13} style={{ color: '#C49746' }} />
                              {app.program?.university?.name || 'German University Track'} &bull; {app.program?.university?.city || 'Germany'}
                            </div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '0.3rem 0.8rem',
                              borderRadius: '999px',
                              background: conf.bg,
                              color: conf.color,
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              border: `1px solid ${conf.color}25`,
                            }}
                          >
                            {conf.label}
                          </span>
                          <div style={{ fontSize: '0.725rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                            Updated {new Date(app.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Stepper Track */}
                      <div className="apply-stepper-track">
                        {[
                          { name: 'Requested', step: 1 },
                          { name: 'Under Review', step: 2 },
                          { name: 'Docs Verified', step: 3 },
                          { name: 'Submitted', step: 4 },
                        ].map((s) => {
                          const isPassed = conf.step > s.step;
                          const isCurrent = conf.step === s.step;
                          return (
                            <div key={s.name} className="apply-stepper-node">
                              <div
                                className="apply-stepper-line"
                                style={{
                                  background: isPassed
                                    ? '#0F172A'
                                    : isCurrent
                                    ? '#C49746'
                                    : '#E2E8F0',
                                }}
                              />
                              <span
                                className="apply-stepper-label"
                                style={{
                                  fontWeight: isPassed || isCurrent ? 700 : 500,
                                  color: isPassed
                                    ? '#0F172A'
                                    : isCurrent
                                    ? '#C49746'
                                    : '#94A3B8',
                                }}
                              >
                                {isPassed && <Check size={12} style={{ color: '#0F172A' }} />}
                                {isCurrent && <Clock size={12} style={{ color: '#C49746' }} />}
                                {s.name}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.35rem 0.75rem', borderRadius: '8px', fontWeight: 600, color: '#475569' }}>
                            <FileText size={14} /> {app.documents?.length || 0} Attachment(s)
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: msgCount ? '#FEF3C7' : '#F8FAFC', border: msgCount ? '1px solid #FDE68A' : '1px solid #E2E8F0', padding: '0.35rem 0.75rem', borderRadius: '8px', fontWeight: 600, color: msgCount ? '#B45309' : '#64748B' }}>
                            <MessageSquare size={14} /> {msgCount} Message(s)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setDetailApp(app)}
                          style={{
                            background: '#0F172A',
                            border: 'none',
                            color: '#ffffff',
                            padding: '0.65rem 1.35rem',
                            borderRadius: '10px',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 10px rgba(15, 23, 42, 0.15)',
                            transition: 'all 150ms ease',
                          }}
                        >
                          Open Request & Advisor Chat <ChevronRight size={15} style={{ color: '#C49746' }} />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRO DOCUMENT VAULT */}
        {activeTab === 'vault' && (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem 1.75rem', border: '1px solid #E2E8F0', boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  <FolderLock size={22} style={{ color: '#C49746' }} /> PRO Document Vault
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem', margin: 0 }}>
                  Upload your official academic documents (CV, Degree, Transcripts, CNIC, IELTS, Passport) directly from your computer.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSaveVault}
                disabled={savingVault}
                style={{
                  background: '#0F172A',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.7rem 1.6rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 180ms ease',
                }}
              >
                <UploadCloud size={16} style={{ color: '#C49746' }} /> {savingVault ? 'Submitting...' : 'Submit Documents'}
              </button>
            </div>

            {vaultMsg && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: '#D1FAE5', color: '#047857', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                ✓ {vaultMsg}
              </div>
            )}

            {/* Document Vault Progress Readiness Meter */}
            <div className="vault-meter-card">
              <div style={{ flex: 1, minWidth: '220px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
                  <span style={{ color: '#0F172A' }}>
                    Application Readiness: {Math.round((uploadedDocsCount / 9) * 100)}%
                  </span>
                  <span style={{ color: '#64748B' }}>
                    {uploadedDocsCount} of 9 Documents Prepared
                  </span>
                </div>
                <div className="vault-progress-bar-bg">
                  <div
                    className="vault-progress-bar-fill"
                    style={{ width: `${Math.round((uploadedDocsCount / 9) * 100)}%` }}
                  />
                </div>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748B', maxWidth: '300px', lineHeight: 1.5 }}>
                {uploadedDocsCount >= 6 ? (
                  <span style={{ color: '#047857', fontWeight: 600 }}>✓ Key academic documents ready for German university processing.</span>
                ) : (
                  <span>Upload your required certificates and transcripts so our advisor can begin Bavarian formula conversion.</span>
                )}
              </div>
            </div>

            {/* Document Upload Slots Grid */}
            <div className="vault-doc-grid">
              {VAULT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const currentDoc = vaultData[cat.key] || {};
                const isUploaded = Boolean(currentDoc.name || currentDoc.url);

                return (
                  <div
                    key={cat.key}
                    className={`vault-doc-tile ${isUploaded ? 'uploaded' : ''}`}
                  >
                    <div>
                      <div className="vault-tile-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: '10px',
                              background: '#F1F5F9',
                              color: '#0F172A',
                              border: '1px solid #E2E8F0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                              {cat.label} {cat.required && <span style={{ color: '#DC2626' }}>*</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.15rem', lineHeight: 1.4 }}>
                              {cat.desc}
                            </div>
                          </div>
                        </div>

                        <span
                          className="vault-status-badge"
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            background: isUploaded ? '#D1FAE5' : '#FEF3C7',
                            color: isUploaded ? '#047857' : '#B45309',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            alignSelf: 'flex-start',
                          }}
                        >
                          {isUploaded ? '✓ Uploaded' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {isUploaded ? (
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '0.75rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                          <FileCheck size={18} style={{ color: '#0F172A', flexShrink: 0 }} />
                          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                              {currentDoc.name}
                            </span>
                            {currentDoc.size && (
                              <span style={{ fontSize: '0.7rem', color: '#64748B' }}>
                                {currentDoc.size}
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                          {currentDoc.url && (
                            <a
                              href={currentDoc.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ background: '#ffffff', border: '1px solid #E2E8F0', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}
                            >
                              View
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveVaultFile(cat.key)}
                            style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', padding: '0.35rem 0.55rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ position: 'relative', marginTop: '0.5rem' }}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: '#ffffff',
                            border: '1.5px dashed #CBD5E1',
                            borderRadius: '10px',
                            padding: '0.85rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                            transition: 'all 150ms ease',
                          }}
                        >
                          <UploadCloud size={16} style={{ color: '#0F172A' }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0F172A' }}>
                            Upload Document (.pdf, .doc, .jpg)
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            onChange={(e) => handleLocalFileSelect(cat.key, e)}
                            style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Submit Documents Button */}
            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
              <button
                type="button"
                onClick={handleSaveVault}
                disabled={savingVault}
                style={{
                  background: '#0F172A',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 180ms ease',
                }}
              >
                <UploadCloud size={18} style={{ color: '#C49746' }} /> {savingVault ? 'Submitting Documents...' : 'Submit Documents'}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* MODAL 1: REQUEST SUBMITTED SUCCESS POPUP */}
      {showReqSuccessModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              padding: '2.25rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
              border: '1px solid rgba(196, 151, 70, 0.35)',
            }}
          >
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#F8FAFC', border: '1px solid rgba(196, 151, 70, 0.4)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
              Application Request Submitted!
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#64748B', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Your request is submitted. Our consultancy advisor will contact you shortly.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setShowReqSuccessModal(false);
                  setActiveTab('vault');
                }}
                style={{
                  background: '#0F172A',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.65rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 180ms ease',
                }}
              >
                <FolderLock size={16} style={{ color: '#C49746' }} /> Proceed to Upload Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DOCUMENTS SUBMITTED POPUP */}
      {showDocsSubmittedModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 300,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '560px',
              padding: '2.25rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
              border: feeStatus === 'paid' ? '1.5px solid #10B981' : '1.5px solid rgba(196, 151, 70, 0.45)',
            }}
          >
            {feeStatus === 'paid' ? (
              <>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#F8FAFC', border: '1px solid rgba(196, 151, 70, 0.4)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle2 size={36} />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Documents Uploaded Successfully
                </h3>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.925rem', color: '#0F172A', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    Your documents are uploaded successfully. Our team will evaluate them and let you know shortly.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowDocsSubmittedModal(false)}
                    style={{
                      background: '#0F172A',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.85rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                    }}
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <ShieldCheck size={36} />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Documents Submitted
                </h3>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.925rem', color: '#0F172A', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    Thank you! Your documents are submitted, but your application will be started only when payment will be confirmed.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setShowDocsSubmittedModal(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #E2E8F0',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      color: '#475569',
                    }}
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowDocsSubmittedModal(false);
                      setShowPaymentModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #C49746 0%, #B45309 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.65rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(196, 151, 70, 0.35)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <CreditCard size={16} /> Pay Fee PKR 45,000 Online
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: INITIATE APPLICATION REQUEST MODAL */}
      {showApplyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 250,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
              border: '1px solid rgba(196, 151, 70, 0.35)',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #070D1B 0%, #0F172A 60%, #1E293B 100%)', color: '#ffffff', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Initiate Application Request
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.2rem 0 0' }}>
                  Select your target study field or university program for our consultancy team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApplyModal(false)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.75rem' }}>
              {appError && (
                <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: '#FEE2E2', color: '#B91C1C', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  {appError}
                </div>
              )}

              <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                    Target Field of Study *
                  </label>
                  
                  <select
                    value={selectedTarget}
                    onChange={(e) => setSelectedTarget(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#0F172A',
                      background: '#F8FAFC',
                      outline: 'none',
                    }}
                  >
                    <option value="">-- Select your target field of study --</option>
                    {ACADEMIC_FIELDS.map((field) => (
                      <option key={field.id} value={field.id}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                    Field Description & Special Notes *
                  </label>
                  <textarea
                    rows={4}
                    required={selectedTarget === 'field_other'}
                    placeholder={
                      selectedTarget === 'field_other'
                        ? 'Please specify your target program, field details, university preferences, and preferred semester intake...'
                        : 'Mention your target intake semester (e.g. Winter 2026), preferred cities, specific university preferences, or current CGPA...'
                    }
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.8rem 1rem',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.875rem',
                      color: '#0F172A',
                      background: '#F8FAFC',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    style={{ background: 'transparent', border: '1px solid #E2E8F0', padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#475569' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApp}
                    style={{
                      background: '#0F172A',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.65rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                    }}
                  >
                    {submittingApp ? 'Submitting...' : 'Submit Application Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL PAYMENT UPLOAD MODAL */}
      {showPaymentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 350,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#F8FAFC',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '850px',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.35)',
              border: '1px solid #E2E8F0',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: '#ffffff',
                padding: '1.25rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #E2E8F0'
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                  Premium Subscription
                </h3>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', color: '#64748B', fontSize: '0.9rem', marginRight: '1rem' }}>
                  <span style={{cursor: 'pointer'}}>Upgrade</span>
                  <span style={{cursor: 'pointer'}}>Plans</span>
                  <span style={{cursor: 'pointer'}}>Help</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  style={{ background: '#F1F5F9', border: 'none', color: '#64748B', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              
              {/* Left Column: Instructions */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' }}>
                <div style={{ background: '#1C5B3F', color: '#ffffff', padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <CreditCard size={20} />
                  <span style={{ fontWeight: 600, fontSize: '1.05rem' }}>Payment Instructions</span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>1. BANK TRANSFER (HBL)</h4>
                  <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6, position: 'relative' }}>
                    Account Holder:<br/>
                    <strong style={{color: '#0F172A'}}>Orbon Consultancy</strong><br/>
                    Account Number:<br/>
                    <strong style={{color: '#0F172A'}}>1234 5678 9012 3456</strong><br/>
                    IBAN:<br/>
                    <strong style={{color: '#0F172A'}}>PK72HBL01234567890123456</strong><br/>
                    Bank: HBL
                  </div>
                  <div style={{borderBottom: '1px solid #E2E8F0', margin: '1rem 0'}}></div>
                </div>

                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', textTransform: 'uppercase' }}>2. EASYPAISA</h4>
                  <div style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Account Name: <strong style={{color: '#0F172A'}}>Orbon Consultancy</strong><br/>
                    Number: <strong style={{color: '#0F172A'}}>0312-3456789</strong>
                  </div>
                </div>
              </div>

              {/* Right Column: Upload Form */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem 1.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', border: '1px solid #E2E8F0' }}>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
                  Submit Payment Receipt
                </h3>
                
                <form onSubmit={handleProcessManualPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                      Transaction ID
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>Enter Transaction ID (10-15 digits)</span>
                    <input
                      type="text"
                      required
                      placeholder="e.g., ABC123DEF456"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      style={{ width: '100%', padding: '0.85rem 1rem', borderRadius: '8px', border: '2px solid #82A392', fontSize: '0.95rem', color: '#0F172A', background: '#ffffff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.2rem' }}>
                      Payment Screenshot
                    </label>
                    <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginBottom: '0.5rem' }}>Upload Payment Screenshot (JPG, PNG, max 5MB)</span>
                    
                    <div style={{ position: 'relative', border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2rem 1rem', textAlign: 'center', background: '#F8FAFC', transition: 'all 0.2s ease' }}>
                      <input 
                        type="file" 
                        accept="image/*" 
                        required 
                        onChange={handleScreenshotSelect}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} 
                      />
                      {paymentScreenshot ? (
                        <div style={{ color: '#1C5B3F', fontWeight: 600 }}>
                          <CheckCircle2 size={28} style={{ margin: '0 auto 0.5rem' }} />
                          {paymentScreenshot.name}
                        </div>
                      ) : (
                        <div>
                          <UploadCloud size={28} style={{ color: '#64748B', margin: '0 auto 0.5rem' }} />
                          <div style={{ fontSize: '0.9rem', color: '#0F172A', marginBottom: '0.25rem' }}>
                            Drag & Drop your screenshot<br/>or <span style={{ color: '#1C5B3F', textDecoration: 'underline' }}>Browse</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>File requirements, file or dire only</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={processingPayment}
                    style={{
                      background: '#1C5B3F',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.85rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      cursor: 'pointer',
                      marginTop: '0.5rem',
                      width: '100%'
                    }}
                  >
                    {processingPayment ? 'Submitting...' : 'Submit Verification'}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* RECEIPT POPUP */}
      {receiptData && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '520px',
              padding: '2.25rem',
              boxShadow: '0 30px 60px rgba(15, 23, 42, 0.3)',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
            }}
          >
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#F8FAFC', border: '1px solid rgba(196, 151, 70, 0.4)', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Check size={36} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem', fontFamily: "'Playfair Display', Georgia, serif" }}>
              Payment Successful!
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#0F172A', fontWeight: 600, marginBottom: '1.5rem' }}>
              Your payment receipt has been submitted for verification.
            </p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '14px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#64748B' }}>Transaction ID:</span>
                <strong style={{ color: '#0F172A', fontFamily: 'monospace' }}>{receiptData.trx_id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#64748B' }}>Screenshot Attached:</span>
                <strong style={{ color: '#047857' }}>Yes</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#64748B' }}>Amount Paid:</span>
                <strong style={{ color: '#0F172A', fontSize: '1rem' }}>{receiptData.amount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748B' }}>Date & Time:</span>
                <span style={{ color: '#0F172A' }}>{receiptData.date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => window.print()}
                style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#0F172A', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
                type="button"
                onClick={() => setReceiptData(null)}
                style={{ background: '#0F172A', color: '#ffffff', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '8px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL & CHAT MODAL */}
      {detailApp && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px rgba(15, 23, 42, 0.25)',
              border: '1px solid rgba(196, 151, 70, 0.35)',
              overflow: 'hidden',
            }}
          >
            <div style={{ background: 'linear-gradient(135deg, #070D1B 0%, #0F172A 60%, #1E293B 100%)', color: '#ffffff', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Application Request & Live Advisor Chat
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.85)', margin: '0.2rem 0 0' }}>
                  {detailApp.program?.name || 'University Application'} &bull; {detailApp.program?.university?.name || 'Germany'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailApp(null)}
                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Current Status</span>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', background: (STATUS_CONFIG[detailApp.status] || STATUS_CONFIG.pending).bg, color: (STATUS_CONFIG[detailApp.status] || STATUS_CONFIG.pending).color, fontWeight: 700, fontSize: '0.825rem' }}>
                      {(STATUS_CONFIG[detailApp.status] || STATUS_CONFIG.pending).label}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Target Intake</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginTop: '0.2rem' }}>Winter Semester 2026</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={18} style={{ color: '#C49746' }} /> Live Communication Feed with Advisor
                </h4>

                <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '1.25rem', border: '1px solid #E2E8F0', minHeight: '180px', maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {!detailApp.messages || detailApp.messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748B', fontSize: '0.85rem' }}>
                      No messages exchanged yet. Send a message below to ask your consultancy advisor anything!
                    </div>
                  ) : (
                    detailApp.messages.map((m, idx) => {
                      const isStudent = m.sender === 'student';
                      return (
                        <div
                          key={idx}
                          style={{
                            alignSelf: isStudent ? 'flex-end' : 'flex-start',
                            maxWidth: '82%',
                            background: isStudent ? '#0F172A' : '#ffffff',
                            color: isStudent ? '#ffffff' : '#0F172A',
                            padding: '0.75rem 1rem',
                            borderRadius: isStudent ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.05)',
                            border: isStudent ? 'none' : '1px solid #E2E8F0',
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#C49746', marginBottom: '0.2rem' }}>
                            {m.sender_name || (isStudent ? 'You' : 'Consultancy Advisor')}
                          </div>
                          <div style={{ fontSize: '0.875rem', lineHeight: 1.45 }}>{m.message}</div>
                        </div>
                      );
                    })
                  )}
                </div>

                <form onSubmit={handleSendChatMessage} style={{ marginTop: '0.75rem', display: 'flex', gap: '0.6rem' }}>
                  <input
                    type="text"
                    placeholder="Type your message to consultancy advisor..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.875rem', color: '#0F172A', outline: 'none' }}
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !chatMessage.trim()}
                    style={{
                      background: '#0F172A',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.35rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.15)',
                    }}
                  >
                    <Send size={15} /> Send
                  </button>
                </form>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setDetailApp(null)}
                style={{ background: '#0F172A', color: '#ffffff', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
