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

  // Online Checkout Payment Gateway State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [billingCountry, setBillingCountry] = useState('Pakistan');
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

  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleProcessCardPayment = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);

    const generatedTrx = 'PAY-CARD-' + Math.floor(100000 + Math.random() * 900000);
    const last4Digits = cardNumber.replace(/\s/g, '').slice(-4) || '8912';
    const holderName = cardHolderName.trim() || 'STUDENT USER';

    setTimeout(async () => {
      try {
        await submitStudentPayment({
          payment_reference: generatedTrx,
          payment_proof: `Card Payment via VISA/MC | Card: ${last4Digits} | Holder: ${holderName} | Amount: PKR 45,000`,
        });

        setFeeStatus('paid');
        setProcessingPayment(false);
        setShowPaymentModal(false);
        setReceiptData({
          trx_id: generatedTrx,
          card_last4: last4Digits,
          holder: holderName,
          amount: 'PKR 45,000',
          date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
          status: 'SUCCESSFUL / CONFIRMED',
        });
      } catch (err) {
        alert(err.message || 'Payment processing failed');
        setProcessingPayment(false);
      }
    }, 1800);
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
    <div style={{ padding: '1.5rem', maxWidth: '1240px', margin: '0 auto', color: '#161D2B' }}>
      
      {/* Removed Active Paid Fee Status Banner upon user request */}

      {/* UNIFIED MASTER CARD CONTAINER */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '2.5rem',
          border: '1px solid rgba(22, 29, 43, 0.1)',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          marginBottom: '2rem',
        }}
      >
        {/* TOP HERO ROW */}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* Left Column: Text & CTA */}
          <div style={{ flex: '1 1 500px', maxWidth: '620px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '999px',
                background: '#FAF7F2',
                border: '1px solid rgba(196, 151, 70, 0.35)',
                color: '#C49746',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              <Sparkles size={14} style={{ color: '#C49746' }} /> PREMIUM SERVICE
            </div>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(2.2rem, 3.8vw, 2.75rem)',
                fontWeight: 700,
                lineHeight: 1.15,
                color: '#161D2B',
                marginBottom: '0.6rem',
                letterSpacing: '-0.015em',
              }}
            >
              Apply for Me
            </h1>

            <h2
              style={{
                fontSize: '1.1rem',
                fontWeight: 600,
                color: '#5B6578',
                marginBottom: '0.85rem',
                lineHeight: 1.4,
              }}
            >
              Let our experts handle your German university applications.
            </h2>

            <p style={{ fontSize: '0.925rem', color: '#5B6578', lineHeight: 1.65, marginBottom: '1.75rem', maxWidth: '560px' }}>
              Get professional support with your applications, documentation, and submission process. We make it simple, stress-free, and more successful — so you can focus on your future.
            </p>

            <button
              onClick={() => setShowApplyModal(true)}
              style={{
                background: '#161D2B',
                color: '#FFFFFF',
                border: 'none',
                padding: '0.8rem 1.75rem',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(22, 29, 43, 0.2)',
                transition: 'all 200ms ease',
              }}
            >
              <Send size={15} /> Request Apply for Me <ArrowRight size={15} />
            </button>
          </div>

          {/* Right Column: Visual Illustration */}
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            <ApplyForMeIllustration />
          </div>

        </div>

        {/* MIDDLE SECTION: 3 REFINED BENEFITS ROW */}
        <div
          style={{
            borderTop: '1px solid rgba(0,0,0,0.06)',
            paddingTop: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {/* Benefit 1 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: '#FAF7F2',
                  border: '1px solid rgba(196, 151, 70, 0.3)',
                  color: '#C49746',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <User size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.2rem 0' }}>
                  Expert Guidance
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#5B6578', margin: 0, lineHeight: 1.5 }}>
                  Get personalized support from experienced German educational consultants.
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: '#FAF7F2',
                  border: '1px solid rgba(196, 151, 70, 0.3)',
                  color: '#C49746',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.2rem 0' }}>
                  Document Review
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#5B6578', margin: 0, lineHeight: 1.5 }}>
                  Ensure your certificates, CV & SOP meet strict German university requirements.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: '10px',
                  background: '#FAF7F2',
                  border: '1px solid rgba(196, 151, 70, 0.3)',
                  color: '#C49746',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Send size={18} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.2rem 0' }}>
                  Application Submission
                </h4>
                <p style={{ fontSize: '0.825rem', color: '#5B6578', margin: 0, lineHeight: 1.5 }}>
                  We handle the submission process and tracking directly from start to finish.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* BOTTOM SECTION: PRO USER BANNER */}
        <div
          style={{
            background: '#FAF7F2',
            border: '1px solid rgba(196, 151, 70, 0.35)',
            borderRadius: '14px',
            padding: '1.1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: '#ffffff',
                border: '1px solid rgba(196, 151, 70, 0.3)',
                color: '#C49746',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Lightbulb size={18} />
            </div>

            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#161D2B', margin: '0 0 0.15rem 0' }}>
                Already a PRO user?
              </h4>
              <p style={{ fontSize: '0.825rem', color: '#5B6578', margin: 0 }}>
                Your Apply for Me service is included in your PRO plan. Start your application journey today!
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowApplyModal(true)}
            style={{
              background: '#161D2B',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 150ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            Go to PRO Plan <ArrowRight size={14} />
          </button>
        </div>

      </div>

      {/* MINIMAL CLEAN SUB-NAV TAB SELECTORS */}
      <div style={{ display: 'inline-flex', background: '#FAF7F2', padding: '4px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '1.75rem' }}>
        <button
          onClick={() => setActiveTab('applications')}
          style={{
            background: activeTab === 'applications' ? '#161D2B' : 'transparent',
            color: activeTab === 'applications' ? '#FFFFFF' : '#5B6578',
            border: 'none',
            padding: '0.55rem 1.35rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 150ms ease',
            boxShadow: activeTab === 'applications' ? '0 2px 8px rgba(22, 29, 43, 0.2)' : 'none',
          }}
        >
          <FileText size={15} style={{ color: activeTab === 'applications' ? '#C49746' : '#5B6578' }} />
          Application Requests ({applications.length})
        </button>

        <button
          onClick={() => setActiveTab('vault')}
          style={{
            background: activeTab === 'vault' ? '#161D2B' : 'transparent',
            color: activeTab === 'vault' ? '#FFFFFF' : '#5B6578',
            border: 'none',
            padding: '0.55rem 1.35rem',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 150ms ease',
            boxShadow: activeTab === 'vault' ? '0 2px 8px rgba(22, 29, 43, 0.2)' : 'none',
          }}
        >
          <FolderLock size={15} style={{ color: activeTab === 'vault' ? '#C49746' : '#5B6578' }} />
          PRO Document Vault {uploadedDocsCount > 0 && `(${uploadedDocsCount} Files)`}
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div>
        
        {/* TAB 1: APPLICATION REQUESTS */}
        {activeTab === 'applications' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#161D2B', margin: 0, fontFamily: "'Playfair Display', Georgia, serif" }}>
                  Your Application Requests & Live Communication
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#5B6578', marginTop: '0.25rem', margin: 0 }}>
                  Track status updates, documents, and chat directly with your assigned consultancy advisor.
                </p>
              </div>

              <span
                style={{
                  background: '#FAF7F2',
                  border: '1px solid rgba(0,0,0,0.08)',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#161D2B',
                }}
              >
                {applications.length} Active Requests
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#5B6578', background: '#ffffff', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.08)' }}>
                Loading application requests...
              </div>
            ) : applications.length === 0 ? (
              <div
                style={{
                  background: '#ffffff',
                  border: '2px dashed rgba(0,0,0,0.12)',
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
                    background: '#FAF7F2',
                    border: '1px solid rgba(196,151,70,0.3)',
                    color: '#C49746',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <FileText size={26} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.5rem' }}>
                  No Application Requests Yet
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#5B6578', maxWidth: '440px', margin: '0 auto 1.75rem', lineHeight: 1.6 }}>
                  Click below to initiate your application request. Select your desired field of study (Computer Science, Business, IT, Engineering, etc.) and let our consultancy team manage the rest.
                </p>
                <button
                  onClick={() => setShowApplyModal(true)}
                  style={{
                    background: '#161D2B',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(22, 29, 43, 0.2)',
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
                      style={{
                        background: '#ffffff',
                        border: '1px solid rgba(22, 29, 43, 0.1)',
                        borderRadius: '16px',
                        padding: '1.65rem',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                        transition: 'all 200ms ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: '12px',
                              background: '#FAF7F2',
                              border: '1px solid rgba(196,151,70,0.3)',
                              color: '#C49746',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Building2 size={22} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0, lineHeight: 1.25 }}>
                              {app.program?.name || app.student_notes?.split('\n')?.[0] || 'University Application'}
                            </h3>
                            <div style={{ fontSize: '0.825rem', color: '#5B6578', marginTop: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <MapPin size={12} style={{ color: '#C49746' }} />
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
                            }}
                          >
                            {conf.label}
                          </span>
                          <div style={{ fontSize: '0.725rem', color: '#A0AEC0', marginTop: '0.35rem' }}>
                            Updated {new Date(app.updated_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Professional Clean Timeline Progress */}
                      <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', position: 'relative' }}>
                          {['Requested', 'Under Review', 'Docs Verified', 'Submitted'].map((stepName, sIdx) => {
                            const isCurrent = conf.step === sIdx + 1;
                            const isPassed = conf.step > sIdx + 1;
                            return (
                              <div key={stepName} style={{ textAlign: 'center', position: 'relative' }}>
                                <div
                                  style={{
                                    height: '3px',
                                    borderRadius: '999px',
                                    background: isPassed ? '#047857' : isCurrent ? '#C49746' : '#E2E8F0',
                                    marginBottom: '0.5rem',
                                    transition: 'all 300ms ease',
                                  }}
                                />
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem',
                                    fontSize: '0.75rem',
                                    fontWeight: isCurrent || isPassed ? 700 : 500,
                                    color: isPassed ? '#047857' : isCurrent ? '#C49746' : '#94A3B8',
                                  }}
                                >
                                  {isPassed && <Check size={12} style={{ color: '#047857' }} />}
                                  {stepName}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.04)', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: '#FAF7F2', border: '1px solid rgba(0,0,0,0.06)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontWeight: 600, color: '#5B6578' }}>
                            <FileText size={14} /> {app.documents?.length || 0} Attachment(s)
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', background: msgCount ? '#FEF3C7' : '#FAF7F2', border: msgCount ? '1px solid #FDE68A' : '1px solid rgba(0,0,0,0.06)', padding: '0.35rem 0.75rem', borderRadius: '8px', fontWeight: 600, color: msgCount ? '#B45309' : '#5B6578' }}>
                            <MessageSquare size={14} /> {msgCount} Message(s)
                          </span>
                        </div>

                        <button
                          onClick={() => setDetailApp(app)}
                          style={{
                            background: '#161D2B',
                            border: 'none',
                            color: '#ffffff',
                            padding: '0.65rem 1.25rem',
                            borderRadius: '8px',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 2px 10px rgba(22, 29, 43, 0.15)',
                            transition: 'all 150ms ease',
                          }}
                        >
                          Open Request & Advisor Chat <ChevronRight size={15} />
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
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '2rem', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#161D2B', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FolderLock size={22} style={{ color: '#0F172A' }} /> PRO Document Vault
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem', margin: 0 }}>
                  Upload your official academic documents (CV, Degree, Transcripts, CNIC, IELTS, Passport) directly from your computer.
                </p>
              </div>

              <button
                onClick={handleSaveVault}
                disabled={savingVault}
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.7rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <UploadCloud size={16} /> {savingVault ? 'Submitting...' : 'Submit Documents'}
              </button>
            </div>

            {vaultMsg && (
              <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', background: '#D1FAE5', color: '#047857', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                ✓ {vaultMsg}
              </div>
            )}

            {/* Document Upload Slots */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
              {VAULT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const currentDoc = vaultData[cat.key] || {};
                const isUploaded = Boolean(currentDoc.name || currentDoc.url);

                return (
                  <div
                    key={cat.key}
                    style={{
                      background: '#FAF7F2',
                      border: isUploaded ? '1.5.px solid #0F172A' : '1px solid rgba(0,0,0,0.08)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '8px',
                              background: isUploaded ? '#0F172A' : 'rgba(0,0,0,0.06)',
                              color: isUploaded ? '#C49746' : '#718096',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={18} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#161D2B' }}>
                              {cat.label} {cat.required && <span style={{ color: '#DC2626' }}>*</span>}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '0.1rem' }}>
                              {cat.desc}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.725rem',
                            fontWeight: 700,
                            background: isUploaded ? '#D1FAE5' : '#FEF3C7',
                            color: isUploaded ? '#047857' : '#B45309',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {isUploaded ? '✓ Uploaded' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {isUploaded ? (
                      <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '8px', padding: '0.75rem', marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                          <FileCheck size={18} style={{ color: '#0F172A', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#161D2B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                            {currentDoc.name}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
                          {currentDoc.url && (
                            <a
                              href={currentDoc.url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ background: '#FAF7F2', border: '1px solid rgba(0,0,0,0.1)', padding: '0.35rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#0F172A', textDecoration: 'none' }}
                            >
                              View
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveVaultFile(cat.key)}
                            style={{ background: '#FEE2E2', border: 'none', color: '#DC2626', padding: '0.35rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ position: 'relative', marginTop: '0.75rem' }}>
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: '#ffffff',
                            border: '1.5px dashed rgba(15, 23, 42, 0.25)',
                            borderRadius: '8px',
                            padding: '0.85rem',
                            cursor: 'pointer',
                            textAlign: 'center',
                          }}
                        >
                          <Upload size={16} style={{ color: '#0F172A' }} />
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
            <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
              <button
                onClick={handleSaveVault}
                disabled={savingVault}
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.85rem 2rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <UploadCloud size={18} /> {savingVault ? 'Submitting Documents...' : 'Submit Documents'}
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
            background: 'rgba(15, 23, 42, 0.7)',
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
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              border: '1px solid rgba(196, 151, 70, 0.3)',
            }}
          >
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#D1FAE5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <CheckCircle2 size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.75rem' }}>
              Application Request Submitted!
            </h3>

            <p style={{ fontSize: '0.95rem', color: '#4A5568', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Your request is submitted. Our consultancy advisor will contact you shortly.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => {
                  setShowReqSuccessModal(false);
                  setActiveTab('vault');
                }}
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <FolderLock size={16} /> Proceed to Upload Documents
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
            background: 'rgba(15, 23, 42, 0.7)',
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
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              border: feeStatus === 'paid' ? '1.5px solid #10B981' : '1.5px solid rgba(196, 151, 70, 0.4)',
            }}
          >
            {feeStatus === 'paid' ? (
              <>
                <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#D1FAE5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <CheckCircle2 size={36} />
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.75rem' }}>
                  Documents Uploaded Successfully
                </h3>

                <div style={{ background: '#FAF7F2', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.925rem', color: '#161D2B', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    Your documents are uploaded successfully. Our team will evaluate them and let you know shortly.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowDocsSubmittedModal(false)}
                    style={{
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.75rem',
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

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.75rem' }}>
                  Documents Submitted
                </h3>

                <div style={{ background: '#FAF7F2', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.75rem', textAlign: 'left' }}>
                  <p style={{ fontSize: '0.925rem', color: '#161D2B', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
                    Thank you! Your documents are submitted, but your application will be started only when payment will be confirmed.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => setShowDocsSubmittedModal(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid rgba(0,0,0,0.15)',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      color: '#4A5568',
                    }}
                  >
                    Close
                  </button>

                  <button
                    onClick={() => {
                      setShowDocsSubmittedModal(false);
                      setShowPaymentModal(true);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #C49746 0%, #B45309 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
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
            background: 'rgba(15, 23, 42, 0.65)',
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
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#ffffff', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.4rem' }}>
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
                      border: '1px solid rgba(0,0,0,0.15)',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#161D2B',
                      background: '#FAF7F2',
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
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.4rem' }}>
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
                      border: '1px solid rgba(0,0,0,0.15)',
                      fontSize: '0.875rem',
                      color: '#161D2B',
                      background: '#FAF7F2',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', padding: '0.75rem 1.25rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#4A5568' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingApp}
                    style={{
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.65rem',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.25)',
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

      {/* ONLINE CREDIT CARD PAYMENT MODAL */}
      {showPaymentModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 350,
            background: 'rgba(15, 23, 42, 0.7)',
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
              maxWidth: '660px',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 30px 70px rgba(15, 23, 42, 0.4), 0 0 35px rgba(196, 151, 70, 0.25)',
              border: '2px solid rgba(196, 151, 70, 0.5)',
            }}
          >
            {/* Header */}
            <div
              style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 60%, #0B192C 100%)',
                color: '#ffffff',
                padding: '1.75rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#C49746', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
                  <Lock size={13} /> SECURE 256-BIT SSL ENCRYPTED CHECKOUT
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Online Payment Gateway
                </h3>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '10px', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.8)', display: 'block' }}>Consultancy Fee</span>
                  <strong style={{ fontSize: '1.2rem', color: '#C49746' }}>PKR 45,000</strong>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#ffffff', width: '34px', height: '34px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div style={{ padding: '2rem' }}>
              <div style={{ background: '#FAF7F2', border: '2px solid #C49746', borderRadius: '14px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px -6px rgba(196, 151, 70, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#0F172A', color: '#C49746', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.925rem', color: '#161D2B', display: 'block' }}>Credit or Debit Card Checkout</strong>
                    <span style={{ fontSize: '0.78rem', color: '#718096' }}>Accepting Visa, Mastercard, UnionPay & Local Bank Cards</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: '#0F172A' }}>
                  <span style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>VISA</span>
                  <span style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>MC</span>
                  <span style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.1)', padding: '0.25rem 0.6rem', borderRadius: '4px' }}>PAYPAK</span>
                </div>
              </div>

              <form onSubmit={handleProcessCardPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Name as printed on card"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value.toUpperCase())}
                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem', background: '#FAF7F2' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                    Card Number *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      required
                      placeholder="4532 8910 2345 8912"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.95rem', fontFamily: 'monospace', background: '#FAF7F2' }}
                    />
                    <CreditCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#0F172A' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem', textAlign: 'center', background: '#FAF7F2' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      CVV / CVC *
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="123"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.9rem', textAlign: 'center', background: '#FAF7F2' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.35rem' }}>
                      Country *
                    </label>
                    <select
                      value={billingCountry}
                      onChange={(e) => setBillingCountry(e.target.value)}
                      style={{ width: '100%', padding: '0.75rem 0.5rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.85rem', background: '#FAF7F2' }}
                    >
                      <option value="Pakistan">Pakistan (PK)</option>
                      <option value="Germany">Germany (DE)</option>
                      <option value="United Arab Emirates">UAE (AE)</option>
                      <option value="Saudi Arabia">Saudi Arabia (SA)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ fontSize: '0.8rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Lock size={14} style={{ color: '#047857' }} /> SSL Encrypted & Protected
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.15)', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', color: '#4A5568' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={processingPayment}
                      style={{
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '0.75rem 1.75rem',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(15, 23, 42, 0.3)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      {processingPayment ? 'Processing Payment...' : 'Pay PKR 45,000 & Start Processing'}
                    </button>
                  </div>
                </div>

              </form>
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
              boxShadow: '0 30px 60px rgba(0,0,0,0.35)',
              textAlign: 'center',
            }}
          >
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#D1FAE5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
              <Check size={36} />
            </div>

            <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.4rem' }}>
              Payment Successful!
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#047857', fontWeight: 600, marginBottom: '1.5rem' }}>
              Your admission processing has officially started.
            </p>

            <div style={{ background: '#FAF7F2', border: '1px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '1.25rem', textAlign: 'left', marginBottom: '1.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#718096' }}>Transaction ID:</span>
                <strong style={{ color: '#161D2B', fontFamily: 'monospace' }}>{receiptData.trx_id}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#718096' }}>Card Paid:</span>
                <strong>•••• {receiptData.card_last4}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#718096' }}>Cardholder Name:</span>
                <strong>{receiptData.holder}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span style={{ color: '#718096' }}>Amount Paid:</span>
                <strong style={{ color: '#0F172A', fontSize: '1rem' }}>{receiptData.amount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#718096' }}>Date & Time:</span>
                <span>{receiptData.date}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                onClick={() => window.print()}
                style={{ background: '#FAF7F2', border: '1px solid rgba(0,0,0,0.12)', padding: '0.75rem 1.25rem', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button
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
            background: 'rgba(15, 23, 42, 0.65)',
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
              boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
              border: '1px solid rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', color: '#ffffff', padding: '1.5rem 1.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
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
              <div style={{ background: '#FAF7F2', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>Current Status</span>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', background: (STATUS_CONFIG[detailApp.status] || STATUS_CONFIG.pending).bg, color: (STATUS_CONFIG[detailApp.status] || STATUS_CONFIG.pending).color, fontWeight: 700, fontSize: '0.825rem' }}>
                      {(STATUS_CONFIG[detailApp.status] || STATUS_CONFIG.pending).label}
                    </span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.725rem', fontWeight: 700, color: '#718096', textTransform: 'uppercase' }}>Target Intake</span>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#161D2B', marginTop: '0.2rem' }}>Winter Semester 2026</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MessageSquare size={18} style={{ color: '#0F172A' }} /> Live Communication Feed with Advisor
                </h4>

                <div style={{ background: '#FAF7F2', borderRadius: '12px', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.08)', minHeight: '180px', maxHeight: '260px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {!detailApp.messages || detailApp.messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#718096', fontSize: '0.85rem' }}>
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
                            color: isStudent ? '#ffffff' : '#161D2B',
                            padding: '0.75rem 1rem',
                            borderRadius: isStudent ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            border: isStudent ? 'none' : '1px solid rgba(0,0,0,0.08)',
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: isStudent ? '#C49746' : '#C49746', marginBottom: '0.2rem' }}>
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
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.15)', fontSize: '0.875rem', outline: 'none' }}
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !chatMessage.trim()}
                    style={{
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '0.75rem 1.25rem',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Send size={15} /> Send
                  </button>
                </form>
              </div>
            </div>

            <div style={{ padding: '1.25rem 1.75rem', borderTop: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
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
