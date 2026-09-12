import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  FileText,
  CreditCard,
  Info,
  CheckCheck,
  Search,
  ArrowRight,
  ArrowLeft,
  Clock,
  Send,
  User,
  Building2,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Check,
  Plus,
  ExternalLink,
  X,
  ChevronDown,
  MoreVertical,
} from 'lucide-react';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../api/notifications';
import {
  getStudentPremiumApplications,
  getStudentPremiumApplicationDetail,
  postStudentApplicationMessage,
  createStudentPremiumApplication,
} from '../../api/premium';

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: '#B45309', bg: '#FEF3C7' },
  under_review: { label: 'Under Review', color: '#1D4ED8', bg: '#DBEAFE' },
  documents_required: { label: 'Documents Required', color: '#C2410C', bg: '#FFEDD5' },
  in_progress: { label: 'In Progress', color: '#6D28D9', bg: '#EDE9FE' },
  submitted: { label: 'Submitted to Uni', color: '#047857', bg: '#D1FAE5' },
  completed: { label: 'Completed', color: '#047857', bg: '#D1FAE5' },
  rejected_cancelled: { label: 'Cancelled', color: '#B91C1C', bg: '#FEE2E2' },
};

const AVATAR_COLORS = [
  '#F59E0B', // Amber / Gold (like Screenshot 2 & 3)
  '#3B82F6', // Blue
  '#F97316', // Orange
  '#06B6D4', // Cyan
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#EC4899', // Pink
];

export const ACADEMIC_FIELDS = [
  { id: 'field_sci', name: 'Natural Sciences (Physics, Chemistry, Biology)' },
  { id: 'field_cs', name: 'Computer Science & Software Engineering' },
  { id: 'field_it', name: 'Information Technology (IT) & Data Science' },
  { id: 'field_ai', name: 'Artificial Intelligence & Robotics' },
  { id: 'field_eng', name: 'Engineering & Technology' },
  { id: 'field_biz', name: 'Business Administration & Management' },
  { id: 'field_med', name: 'Medicine & Healthcare Sciences' },
  { id: 'field_eco', name: 'Economics & Finance' },
  { id: 'field_other', name: 'Other Academic Field / Custom Track' },
];

function getFieldTitle(app) {
  if (!app) return 'Consultancy Inquiry';

  // 1. Explicit Target Field specified in student_notes
  if (app.student_notes) {
    const lines = app.student_notes.split('\n');
    for (const line of lines) {
      if (line.toLowerCase().startsWith('target field:')) {
        return line.replace(/^target field:\s*/i, '').trim();
      }
    }
  }

  // 2. Keyword detection in student notes
  if (app.student_notes) {
    const lowerNotes = app.student_notes.toLowerCase();
    if (
      lowerNotes.includes('natural science') ||
      lowerNotes.includes('physics') ||
      lowerNotes.includes('chemistry') ||
      lowerNotes.includes('biology')
    ) {
      return 'Natural Sciences (Physics, Chemistry, Biology)';
    }
    if (
      lowerNotes.includes('computer science') ||
      lowerNotes.includes('software') ||
      lowerNotes.includes('data science') ||
      lowerNotes.includes('cybersecurity')
    ) {
      return 'Computer Science & Software Engineering';
    }
    if (
      lowerNotes.includes('business') ||
      lowerNotes.includes('mba') ||
      lowerNotes.includes('management')
    ) {
      return 'Business Administration & Management';
    }
    if (
      lowerNotes.includes('engineering') ||
      lowerNotes.includes('mechanical') ||
      lowerNotes.includes('electrical')
    ) {
      return 'Engineering & Technology';
    }
  }

  // 3. Program field & name
  if (app.program?.field) {
    const pf = app.program.field.toLowerCase();
    if (pf === 'computer science') {
      return 'Computer Science & Software Engineering';
    }
    if (pf === 'natural sciences' || pf === 'chemistry' || pf === 'physics' || pf === 'biology') {
      return 'Natural Sciences (Physics, Chemistry, Biology)';
    }
    return app.program.field;
  }
  if (app.program?.name) {
    return app.program.name;
  }

  // 4. Clean summary from first line of notes if available
  if (app.student_notes && app.student_notes.trim()) {
    const firstLine = app.student_notes.trim().split('\n')[0].trim();
    if (firstLine.length > 0 && firstLine.length <= 60) {
      return firstLine;
    }
  }

  return `Application Request #${app.id}`;
}

function getAvatarColor(appId) {
  return AVATAR_COLORS[(appId || 0) % AVATAR_COLORS.length];
}

function formatRelativeTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return '1 min';
  if (diffMins < 60) return `${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) {
    return d.toLocaleDateString([], { weekday: 'short' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function formatMessageDateDivider(dateStr) {
  if (!dateStr) return 'Recent';
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return 'Today';
  }
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function formatMessageTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function NotificationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [activeThread, setActiveThread] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [sendingMsg, setSendingMsg] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'unread' | 'messages' | 'applications'
  const [search, setSearch] = useState('');

  // New Consultation Chat Modal State
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatField, setNewChatField] = useState(ACADEMIC_FIELDS[0].id);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [creatingChat, setCreatingChat] = useState(false);
  const [newChatError, setNewChatError] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadAllData();
  }, []);

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (activeThread && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeThread?.messages]);

  // Check URL query parameters or location state for direct thread opening
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const appId = params.get('app_id') || location.state?.appId;
    const tab = params.get('tab');

    if (tab === 'messages') {
      setFilterType('messages');
    }

    if (appId && applications.length > 0) {
      const found = applications.find((a) => a.id.toString() === appId.toString());
      if (found) {
        setActiveThread(found);
        setFilterType('messages');
      }
    }
  }, [location.search, location.state, applications]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [notifRes, appsRes] = await Promise.all([
        getNotifications().catch(() => ({ data: [] })),
        getStudentPremiumApplications().catch(() => ({ data: [] })),
      ]);
      const notifs = notifRes.data || [];
      const apps = appsRes.data || [];
      setNotifications(notifs);
      setApplications(apps);

      // Check if location requested a specific thread
      const params = new URLSearchParams(location.search);
      const targetAppId = params.get('app_id') || location.state?.appId;
      if (targetAppId && apps.length > 0) {
        const found = apps.find((a) => a.id.toString() === targetAppId.toString());
        if (found) {
          setActiveThread(found);
          setFilterType('messages');
        }
      }
    } catch (err) {
      console.error('Error fetching notifications & applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleOpenThread = (app) => {
    setActiveThread(app);
    setFilterType('messages');
  };

  const handleNotifClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await markNotificationAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
      } catch (err) {
        console.error('Error marking notification read:', err);
      }
    }

    // 1. Check if linked to an application request (e.g. app_id=1)
    const appIdMatch = notif.link?.match(/app_id=(\d+)/);
    const appId = appIdMatch ? Number(appIdMatch[1]) : null;

    if (appId) {
      const matchedApp = applications.find((a) => a.id === appId);
      if (matchedApp) {
        setActiveThread(matchedApp);
        setFilterType('messages');
        return;
      } else {
        try {
          const res = await getStudentPremiumApplicationDetail(appId);
          if (res.data) {
            setActiveThread(res.data);
            setFilterType('messages');
            return;
          }
        } catch (e) {
          console.warn('Could not load application detail', e);
        }
      }
    }

    // 2. If it's an advisor message notification
    if (notif.type === 'advisor_message') {
      const snippet = notif.message
        ? notif.message.replace(/^System Admin:\s*"?/i, '').replace(/"?\s*$/, '').trim().toLowerCase()
        : '';

      if (snippet && applications.length > 0) {
        const found = applications.find((a) =>
          Array.isArray(a.messages) &&
          a.messages.some((m) =>
            m.message && m.message.toLowerCase().includes(snippet.substring(0, 20))
          )
        );
        if (found) {
          setActiveThread(found);
          setFilterType('messages');
          return;
        }
      }

      // If only 1 application exists, open it directly
      if (applications.length === 1) {
        setActiveThread(applications[0]);
        setFilterType('messages');
        return;
      }

      // If multiple, show the field threads inbox so student can choose
      setFilterType('messages');
      setActiveThread(null);
      return;
    }

    // 3. If it is an application status notification or points to apply-for-me
    if (notif.type === 'application_status' || notif.link?.includes('apply-for-me')) {
      const lowerMsg = (notif.message || '').toLowerCase();
      let matchedStatus = null;
      if (lowerMsg.includes('in progress')) matchedStatus = 'in_progress';
      else if (lowerMsg.includes('under review')) matchedStatus = 'under_review';
      else if (lowerMsg.includes('documents required')) matchedStatus = 'documents_required';
      else if (lowerMsg.includes('submitted')) matchedStatus = 'submitted';
      else if (lowerMsg.includes('completed')) matchedStatus = 'completed';

      if (matchedStatus && applications.length > 0) {
        const found = applications.find((a) => a.status === matchedStatus);
        if (found) {
          setActiveThread(found);
          setFilterType('messages');
          return;
        }
      }

      if (applications.length === 1) {
        setActiveThread(applications[0]);
        setFilterType('messages');
        return;
      }

      // Open field conversations list
      setFilterType('messages');
      setActiveThread(null);
      return;
    }

    // 4. For any other non-apply-for-me internal link
    if (notif.link && !notif.link.includes('apply-for-me')) {
      navigate(notif.link);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || !activeThread || sendingMsg) return;

    const text = chatMessage.trim();
    setSendingMsg(true);
    try {
      const res = await postStudentApplicationMessage(activeThread.id, text);
      const updatedApp = res.data;
      setActiveThread(updatedApp);
      setChatMessage('');
      setApplications((prev) =>
        prev.map((a) => (a.id === updatedApp.id ? updatedApp : a))
      );
    } catch (err) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSendingMsg(false);
    }
  };

  const handleStartNewConversation = async (e) => {
    e.preventDefault();
    setCreatingChat(true);
    setNewChatError('');

    const fieldObj = ACADEMIC_FIELDS.find((f) => f.id === newChatField) || ACADEMIC_FIELDS[0];
    const notesText = `Target Field: ${fieldObj.name}${newChatMessage.trim() ? `\n\nNotes: ${newChatMessage.trim()}` : ''}`;

    try {
      const res = await createStudentPremiumApplication({
        program_id: 1, // baseline reference program
        student_notes: notesText,
        documents: [],
      });

      const newApp = res.data;

      // If user typed an initial message, send it to the chat thread
      if (newChatMessage.trim() && newApp?.id) {
        try {
          const msgRes = await postStudentApplicationMessage(newApp.id, newChatMessage.trim());
          if (msgRes.data) {
            newApp.messages = msgRes.data.messages;
          }
        } catch (mErr) {
          console.warn('Initial message post failed', mErr);
        }
      }

      setApplications((prev) => [newApp, ...prev]);
      setActiveThread(newApp);
      setFilterType('messages');
      setShowNewChatModal(false);
      setNewChatMessage('');
    } catch (err) {
      setNewChatError(err.message || 'Could not start conversation.');
    } finally {
      setCreatingChat(false);
    }
  };

  const filteredNotifs = notifications.filter((item) => {
    if (filterType === 'unread' && item.is_read) return false;
    if (filterType === 'messages' && item.type !== 'advisor_message') return false;
    if (filterType === 'applications' && item.type !== 'application_status') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.title?.toLowerCase().includes(q) ||
        item.message?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'application_status':
        return <FileText size={20} style={{ color: '#C49746' }} />;
      case 'advisor_message':
        return <MessageSquare size={20} style={{ color: '#0F172A' }} />;
      case 'fee_update':
        return <CreditCard size={20} style={{ color: '#047857' }} />;
      default:
        return <Info size={20} style={{ color: '#718096' }} />;
    }
  };

  // Group messages for activeThread chronologically with date dividers
  const groupedThreadMessages = [];
  if (activeThread && Array.isArray(activeThread.messages)) {
    let lastDateGroup = null;
    const sorted = [...activeThread.messages].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    sorted.forEach((m) => {
      const dateGroup = formatMessageDateDivider(m.created_at);
      if (dateGroup !== lastDateGroup) {
        groupedThreadMessages.push({
          type: 'divider',
          text: dateGroup,
          id: `div-${dateGroup}-${m.id}`,
        });
        lastDateGroup = dateGroup;
      }
      groupedThreadMessages.push({
        type: 'message',
        data: m,
        id: `msg-${m.id || Math.random()}`,
      });
    });
  }

  // Count total advisor & student messages across applications
  const totalAdvisorMessages = applications.reduce(
    (acc, a) => acc + (a.messages?.length || 0),
    0
  );

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', padding: '1.5rem 0', color: '#161D2B', position: 'relative' }}>
      
      {/* Page Header */}
      <div className="notifications-header">
        <div>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.15rem)',
              fontWeight: 700,
              color: '#161D2B',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            {activeThread
              ? 'Advisor Chat & Messages'
              : filterType === 'messages'
              ? 'Academic Field Conversations'
              : 'Notifications & Messages'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#5B6578', marginTop: '0.35rem' }}>
            {activeThread
              ? `Direct unified conversation feed for ${getFieldTitle(activeThread)}.`
              : filterType === 'messages'
              ? 'All advisor & student messages grouped by academic field and application tracks.'
              : 'Complete history of advisor messages, status milestones, and official consultancy updates.'}
          </p>
        </div>

        {!activeThread && filterType !== 'messages' && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            style={{
              background: '#FAF7F2',
              border: '1px solid rgba(0,0,0,0.1)',
              color: '#161D2B',
              padding: '0.6rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            <CheckCheck size={16} />
            Mark All as Read
          </button>
        )}

        {activeThread && (
          <button
            type="button"
            onClick={() => setActiveThread(null)}
            style={{
              background: '#FAF7F2',
              border: '1px solid rgba(0,0,0,0.1)',
              color: '#161D2B',
              padding: '0.55rem 1.1rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              whiteSpace: 'nowrap',
              transition: 'all 150ms ease',
            }}
          >
            <ArrowLeft size={16} />
            Back to Conversations
          </button>
        )}
      </div>

      {/* Filter Tabs Bar (Hidden when inside active chat view) */}
      {!activeThread && (
        <div className="notifications-filter-bar">
          <div className="notifications-filter-pills">
            {[
              { id: 'all', label: 'All Updates' },
              { id: 'messages', label: `Advisor Messages (${totalAdvisorMessages})` },
              { id: 'unread', label: 'Unread' },
              { id: 'applications', label: 'Application Status' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setFilterType(tab.id);
                  setActiveThread(null);
                }}
                style={{
                  background: filterType === tab.id ? '#161D2B' : '#FAF7F2',
                  color: filterType === tab.id ? '#FFFFFF' : '#4A5568',
                  border: filterType === tab.id ? 'none' : '1px solid rgba(0,0,0,0.06)',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  whiteSpace: 'nowrap',
                  boxShadow: filterType === tab.id ? '0 2px 8px rgba(22, 29, 43, 0.18)' : 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="notifications-search-wrap" style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder={filterType === 'messages' ? 'Search messages or fields...' : 'Search history...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.85rem 0.45rem 2.2rem',
                borderRadius: '8px',
                border: '1px solid rgba(0,0,0,0.1)',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW 1: ACTIVE CHAT CONVERSATION VIEW (Matching Screenshot 2)
          All messages for selected academic field in one chat
          ========================================================= */}
      {activeThread ? (
        <div className="chat-thread-container">
          
          {/* Chat Header */}
          <div className="chat-thread-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
              <button
                type="button"
                onClick={() => setActiveThread(null)}
                style={{
                  background: '#FAF7F2',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#161D2B',
                  flexShrink: 0,
                  transition: 'all 150ms ease',
                }}
                title="Back to conversations"
              >
                <ArrowLeft size={18} />
              </button>

              {/* Avatar Circle with Field Palette (Screenshot 2 & 3) */}
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: getAvatarColor(activeThread.id),
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                <User size={22} />
              </div>

              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#161D2B',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getFieldTitle(activeThread)}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>Application #{activeThread.id}</span>
                  <span>&bull;</span>
                  <span style={{ color: '#0F172A', fontWeight: 600 }}>German University Admissions Track</span>
                </div>
              </div>
            </div>

            {/* Status Pill Badge */}
            <div style={{ flexShrink: 0 }}>
              <span
                style={{
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  background: (STATUS_CONFIG[activeThread.status] || STATUS_CONFIG.pending).bg,
                  color: (STATUS_CONFIG[activeThread.status] || STATUS_CONFIG.pending).color,
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {(STATUS_CONFIG[activeThread.status] || STATUS_CONFIG.pending).label}
              </span>
            </div>
          </div>

          {/* Chat Timeline Stream (Screenshot 2) */}
          <div className="chat-thread-body">
            
            {/* Active Conversation Feed Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0.25rem 0 0.75rem',
              }}
            >
              <div style={{ background: '#E2E8F0', height: '1px', flex: 1 }} />
              <span
                style={{
                  padding: '0 1rem',
                  color: '#1D4ED8',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                }}
              >
                Active Conversation Feed
              </span>
              <div style={{ background: '#E2E8F0', height: '1px', flex: 1 }} />
            </div>

            {/* Messages Stream */}
            {!activeThread.messages || activeThread.messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748B' }}>
                <MessageSquare size={38} style={{ opacity: 0.3, margin: '0 auto 0.75rem' }} />
                <h4 style={{ fontSize: '1.05rem', color: '#161D2B', margin: '0 0 0.35rem' }}>
                  No messages yet in this field
                </h4>
                <p style={{ fontSize: '0.85rem', margin: 0, maxWidth: '420px', marginInline: 'auto', lineHeight: 1.5 }}>
                  Ask questions, request guidance, or communicate directly with your dedicated German university admissions advisor below.
                </p>
              </div>
            ) : (
              groupedThreadMessages.map((item) => {
                if (item.type === 'divider') {
                  return (
                    <div key={item.id} className="chat-date-pill">
                      {item.text}
                    </div>
                  );
                }

                const m = item.data;
                const isStudent = m.sender === 'student';

                return (
                  <div
                    key={item.id}
                    className={isStudent ? 'chat-bubble-student' : 'chat-bubble-advisor'}
                  >
                    <div
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: isStudent ? '#C49746' : '#B45309',
                        marginBottom: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      {!isStudent && <ShieldCheck size={13} style={{ color: '#B45309' }} />}
                      {m.sender_name || (isStudent ? 'You (Applicant)' : 'Consultancy Advisor')}
                    </div>

                    <div style={{ fontSize: '0.895rem', lineHeight: 1.55, wordBreak: 'break-word' }}>
                      {m.message}
                    </div>

                    <div
                      style={{
                        fontSize: '0.685rem',
                        color: isStudent ? 'rgba(255, 255, 255, 0.65)' : '#94A3B8',
                        marginTop: '0.35rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.25rem',
                      }}
                    >
                      <span>{formatMessageTime(m.created_at)}</span>
                      {isStudent && <CheckCheck size={13} style={{ color: '#C49746' }} />}
                    </div>
                  </div>
                );
              })
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Reply Bar */}
          <div className="chat-reply-bar">
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Type your message to consultancy advisor..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.75rem 1.25rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(0,0,0,0.12)',
                  background: '#FAF7F2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  color: '#161D2B',
                }}
              />
              <button
                type="submit"
                disabled={sendingMsg || !chatMessage.trim()}
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.75rem 1.35rem',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: sendingMsg || !chatMessage.trim() ? 'not-allowed' : 'pointer',
                  opacity: sendingMsg || !chatMessage.trim() ? 0.6 : 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease',
                }}
              >
                <Send size={15} /> Send
              </button>
            </form>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.5rem', textAlign: 'center' }}>
              All messages are synced in real-time with your assigned German education consultant.
            </div>
          </div>

        </div>
      ) : filterType === 'messages' ? (
        
        /* =========================================================
           VIEW 2: GOOGLE MESSAGES INBOX THREADS LIST (Matching Screenshot 3)
           All messages grouped by academic field / application
           ========================================================= */
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: '3.5rem', textAlign: 'center', color: '#718096' }}>
              Loading conversations...
            </div>
          ) : applications.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#718096' }}>
              <MessageSquare size={40} style={{ opacity: 0.25, margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.15rem', color: '#161D2B', margin: 0 }}>No conversations yet</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem', maxWidth: '420px', marginInline: 'auto', lineHeight: 1.5 }}>
                Initiate your first consultation thread in your target academic field (e.g. Natural Sciences, Computer Science) to chat directly with your advisor.
              </p>
              <button
                type="button"
                onClick={() => setShowNewChatModal(true)}
                style={{
                  background: '#161D2B',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.65rem 1.35rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginTop: '1.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <Plus size={16} /> Start Field Consultation
              </button>
            </div>
          ) : (
            <div>
              {applications
                .filter((app) => {
                  if (!search.trim()) return true;
                  const q = search.toLowerCase();
                  const title = getFieldTitle(app).toLowerCase();
                  const lastMsg = app.messages?.[app.messages.length - 1]?.message?.toLowerCase() || '';
                  return title.includes(q) || lastMsg.includes(q);
                })
                .map((app) => {
                  const msgCount = app.messages?.length || 0;
                  const lastMsg = msgCount > 0 ? app.messages[msgCount - 1] : null;
                  const conf = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;

                  return (
                    <div
                      key={app.id}
                      className="inbox-thread-card"
                      onClick={() => handleOpenThread(app)}
                    >
                      {/* Avatar Circle with Field Palette (Screenshot 3) */}
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: getAvatarColor(app.id),
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '1.15rem',
                          flexShrink: 0,
                          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                      >
                        <User size={24} />
                      </div>

                      {/* Content Details */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3
                            style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: '#161D2B',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {getFieldTitle(app)}
                          </h3>
                          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600, flexShrink: 0 }}>
                            {lastMsg ? formatRelativeTime(lastMsg.created_at) : formatRelativeTime(app.created_at)}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <p
                            style={{
                              fontSize: '0.85rem',
                              color: lastMsg ? '#4A5568' : '#94A3B8',
                              margin: 0,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {lastMsg
                              ? `${lastMsg.sender === 'student' ? 'You: ' : 'Advisor: '}${lastMsg.message}`
                              : 'No messages yet. Tap to start chatting with your advisor...'}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                            <span
                              style={{
                                padding: '0.15rem 0.55rem',
                                borderRadius: '999px',
                                background: conf.bg,
                                color: conf.color,
                                fontSize: '0.68rem',
                                fontWeight: 700,
                              }}
                            >
                              {conf.label}
                            </span>
                            {msgCount > 0 && (
                              <span
                                style={{
                                  background: '#1D4ED8',
                                  color: '#FFFFFF',
                                  borderRadius: '999px',
                                  fontSize: '0.68rem',
                                  fontWeight: 700,
                                  padding: '0.15rem 0.5rem',
                                  minWidth: '20px',
                                  textAlign: 'center',
                                }}
                              >
                                {msgCount}
                              </span>
                            )}
                            <ChevronRight size={16} style={{ color: '#CBD5E1' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {/* Bottom Banner to Start Consultation */}
          <div
            style={{
              padding: '1rem 1.5rem',
              background: '#FAF7F2',
              borderTop: '1px solid rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ fontSize: '0.85rem', color: '#5B6578' }}>
              Want guidance for another academic field (e.g. Natural Sciences, CS, Business)?
            </div>
            <button
              type="button"
              onClick={() => setShowNewChatModal(true)}
              style={{
                background: '#161D2B',
                color: '#ffffff',
                border: 'none',
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Plus size={14} /> Start Another Request
            </button>
          </div>
        </div>
      ) : (
        
        /* =========================================================
           VIEW 3: NOTIFICATIONS LIST (Matching Screenshot 1)
           All Updates & System Notifications
           ========================================================= */
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>
              Loading notification history...
            </div>
          ) : filteredNotifs.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#718096' }}>
              <Bell size={36} style={{ opacity: 0.25, margin: '0 auto 0.75rem' }} />
              <h3 style={{ fontSize: '1.1rem', color: '#161D2B', margin: 0 }}>No notifications found</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.35rem' }}>
                {search ? 'Try adjusting your search filter.' : 'You are all caught up! New updates will appear here.'}
              </p>
            </div>
          ) : (
            <div>
              {filteredNotifs.map((notif, idx) => {
                const isMsg = notif.type === 'advisor_message';
                const isAppStatus = notif.type === 'application_status';

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleNotifClick(notif)}
                    style={{
                      padding: '1.25rem 1.5rem',
                      borderBottom: idx !== filteredNotifs.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                      background: notif.is_read ? '#FFFFFF' : 'rgba(196, 151, 70, 0.04)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1.1rem',
                      transition: 'background 150ms ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = notif.is_read ? '#FAF7F2' : 'rgba(196, 151, 70, 0.07)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = notif.is_read ? '#FFFFFF' : 'rgba(196, 151, 70, 0.04)'}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#FAF7F2',
                        border: '1px solid rgba(0,0,0,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {getIcon(notif.type)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.975rem', fontWeight: notif.is_read ? 600 : 700, color: '#161D2B', margin: 0 }}>
                          {notif.title}
                        </h4>
                        <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                          <Clock size={13} />
                          {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: '0.35rem 0 0', lineHeight: 1.55 }}>
                        {notif.message}
                      </p>

                      <div
                        style={{
                          marginTop: '0.55rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          color: isMsg ? '#0F172A' : '#C49746',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        {isMsg ? (
                          <>
                            <MessageSquare size={13} />
                            <span>Open live chat conversation</span>
                            <ArrowRight size={13} />
                          </>
                        ) : isAppStatus ? (
                          <>
                            <FileText size={13} />
                            <span>View conversation thread</span>
                            <ArrowRight size={13} />
                          </>
                        ) : (
                          <>
                            <span>View details</span>
                            <ArrowRight size={13} />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Floating Action Button ("Start chat" - Screenshot 3) */}
      {filterType === 'messages' && !activeThread && (
        <button
          type="button"
          onClick={() => setShowNewChatModal(true)}
          style={{
            position: 'fixed',
            bottom: '2.5rem',
            right: '2.5rem',
            background: '#C2E7FF',
            color: '#001D35',
            border: 'none',
            borderRadius: '16px',
            padding: '0.9rem 1.4rem',
            fontWeight: 700,
            fontSize: '0.925rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.65rem',
            boxShadow: '0 6px 20px rgba(0, 29, 53, 0.25)',
            cursor: 'pointer',
            zIndex: 40,
            transition: 'all 200ms ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 26px rgba(0, 29, 53, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 29, 53, 0.25)';
          }}
        >
          <MessageSquare size={19} />
          <span>Start chat</span>
        </button>
      )}

      {/* =========================================================
          MODAL: START NEW ACADEMIC FIELD CONVERSATION
          ========================================================= */}
      {showNewChatModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              animation: 'fadeInUp 0.2s ease-out',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#FEF3C7',
                    color: '#B45309',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#161D2B', margin: 0 }}>
                    Start New Field Consultation
                  </h3>
                  <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0.15rem 0 0' }}>
                    Connect with an advisor for your specific study program.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleStartNewConversation} style={{ padding: '1.5rem' }}>
              {newChatError && (
                <div
                  style={{
                    padding: '0.75rem',
                    background: '#FEE2E2',
                    color: '#B91C1C',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                  }}
                >
                  {newChatError}
                </div>
              )}

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.45rem' }}>
                  Select Academic Field of Study
                </label>
                <select
                  value={newChatField}
                  onChange={(e) => setNewChatField(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#FAF7F2',
                    color: '#161D2B',
                  }}
                >
                  {ACADEMIC_FIELDS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#161D2B', marginBottom: '0.45rem' }}>
                  Initial Message / Inquiry (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. I want to apply for Masters in Germany in this field, what are the entry requirements?"
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(0,0,0,0.12)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#FAF7F2',
                    color: '#161D2B',
                    resize: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  style={{
                    background: '#FAF7F2',
                    border: '1px solid rgba(0,0,0,0.1)',
                    color: '#4A5568',
                    padding: '0.65rem 1.25rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingChat}
                  style={{
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '0.65rem 1.5rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: creatingChat ? 'not-allowed' : 'pointer',
                    opacity: creatingChat ? 0.7 : 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
                  }}
                >
                  {creatingChat ? 'Creating...' : 'Start Conversation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
