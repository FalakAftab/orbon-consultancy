import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  CheckCheck,
  MessageSquare,
  FileText,
  CreditCard,
  Info,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '../../lib/cn';
import { Avatar } from '../ui';
import { useAuth } from '../../contexts/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../api/notifications';

export function Topbar({ onMenuClick, className, breadcrumb }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Notification system state
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // Dynamic user avatar state
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    if (!user) return;
    const loadAvatar = () => {
      const stored = localStorage.getItem(`user_avatar_${user.id}`);
      if (stored) {
        setAvatarUrl(stored);
      } else if (user?.student_profile?.document_vault?.profile_picture) {
        setAvatarUrl(user.student_profile.document_vault.profile_picture);
      } else {
        setAvatarUrl('');
      }
    };
    loadAvatar();

    const handleAvatarUpdate = () => {
      loadAvatar();
    };
    window.addEventListener('user-avatar-updated', handleAvatarUpdate);
    return () => window.removeEventListener('user-avatar-updated', handleAvatarUpdate);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchNotifs();

    // Auto-poll notifications every 30 seconds for live updates
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [user]);

  // Close dropdown panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unread_count || 0);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim();
    setShowMobileSearch(false);
    // Route intelligently based on query keywords or default to program search
    if (q.toLowerCase().includes('university') || q.toLowerCase().includes('uni')) {
      navigate(`/student/universities?search=${encodeURIComponent(q)}`);
    } else {
      navigate(`/student/programs?search=${encodeURIComponent(q)}`);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed marking all read', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.is_read) {
      try {
        await markNotificationAsRead(notif.id);
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
      } catch (err) {
        console.error('Failed marking notification read', err);
      }
    }
    setShowNotifications(false);

    // Route advisor messages, application status, or apply-for-me links to unified chat
    const appIdMatch = notif.link?.match(/app_id=(\d+)/);
    const appId = appIdMatch ? appIdMatch[1] : null;

    if (
      notif.type === 'advisor_message' ||
      notif.type === 'application_status' ||
      notif.link?.includes('apply-for-me')
    ) {
      navigate(`/student/notifications${appId ? `?app_id=${appId}` : '?tab=messages'}`);
      return;
    }

    if (notif.link) {
      navigate(notif.link);
    } else {
      navigate('/student/notifications');
    }
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'application_status':
        return <FileText size={16} style={{ color: '#C49746' }} />;
      case 'advisor_message':
        return <MessageSquare size={16} style={{ color: '#0F172A' }} />;
      case 'fee_update':
        return <CreditCard size={16} style={{ color: '#047857' }} />;
      default:
        return <Info size={16} style={{ color: '#718096' }} />;
    }
  };

  return (
    <header className={cn('topbar', className)} style={{ gap: '0.75rem', position: 'relative' }}>
      {/* Mobile Search Overlay Bar (< 640px when active) */}
      {showMobileSearch && (
        <form
          onSubmit={handleSearchSubmit}
          style={{
            position: 'absolute',
            inset: 0,
            background: '#FAF7F2',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0 1rem',
            borderBottom: '1px solid rgba(22, 29, 43, 0.12)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <Search size={18} style={{ color: '#C49746', flexShrink: 0 }} />
          <input
            type="text"
            autoFocus
            placeholder="Search programs or universities..."
            aria-label="Global Search Mobile"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '0.55rem 0.85rem',
              fontSize: '0.875rem',
              background: '#ffffff',
              border: '1px solid rgba(22, 29, 43, 0.15)',
              borderRadius: '8px',
              color: '#161D2B',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={() => setShowMobileSearch(false)}
            aria-label="Close Search"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#161D2B',
              padding: '0.4rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </form>
      )}

      {/* 3 Horizontal Lines (Hamburger Toggle Button) */}
      <button
        type="button"
        className="btn btn-ghost btn-icon"
        onClick={onMenuClick}
        aria-label="Toggle Sidebar Navigation"
        title="Toggle Sidebar"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0,0,0,0.08)',
          background: '#FAF7F2',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Menu size={20} style={{ color: '#161D2B' }} />
      </button>

      {breadcrumb && <div className="hidden md:block">{breadcrumb}</div>}

      {/* Desktop Global Search Bar (>= 640px) */}
      <form onSubmit={handleSearchSubmit} className="search-bar topbar-search topbar-search-desktop flex-1 max-w-md" style={{ display: 'flex', alignItems: 'center' }}>
        <Search size={16} className="search-icon" style={{ left: '12px' }} />
        <input
          type="text"
          className="input"
          placeholder="Search programs or universities & press Enter..."
          aria-label="Global Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', paddingLeft: '2.5rem' }}
        />
      </form>

      {/* Mobile Search Icon Button (< 640px) */}
      <button
        type="button"
        className="btn btn-ghost btn-icon topbar-search-mobile-btn"
        onClick={() => setShowMobileSearch(true)}
        aria-label="Open Mobile Search"
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(0,0,0,0.08)',
          background: '#FAF7F2',
          color: '#161D2B',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        <Search size={18} />
      </button>

      <div className="flex-1" />

      {/* NOTIFICATION BUTTON & LIVE POPOVER PANEL */}
      <div className="relative" ref={notifRef}>
        <button
          type="button"
          className="btn btn-ghost btn-icon relative"
          aria-label="Notifications"
          onClick={() => setShowNotifications((prev) => !prev)}
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                minWidth: '16px',
                height: '16px',
                borderRadius: '999px',
                background: '#DC2626',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* POPOVER PANEL */}
        {showNotifications && (
          <div className="topbar-notifications-popover">
            {/* Header */}
            <div
              style={{
                padding: '0.85rem 1.1rem',
                background: '#FAF7F2',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                <strong style={{ fontSize: '0.92rem', color: '#161D2B' }}>Notifications</strong>
                {unreadCount > 0 && (
                  <span
                    style={{
                      background: '#FEF3C7',
                      color: '#B45309',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.12rem 0.45rem',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {unreadCount} Unread
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#0F172A',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.2rem 0.4rem',
                    }}
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close Notifications"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '6px',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ maxHeight: 'min(360px, 60vh)', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#718096', fontSize: '0.85rem' }}>
                  <Bell size={28} style={{ opacity: 0.3, margin: '0 auto 0.5rem' }} />
                  <p style={{ margin: 0 }}>No notifications yet.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                      padding: '0.9rem 1.25rem',
                      borderBottom: '1px solid rgba(0,0,0,0.04)',
                      background: n.is_read ? '#ffffff' : 'rgba(196, 151, 70, 0.05)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      transition: 'background 150ms ease',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        background: '#FAF7F2',
                        border: '1px solid rgba(0,0,0,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}
                    >
                      {getNotifIcon(n.type)}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#161D2B', fontWeight: n.is_read ? 600 : 700 }}>
                          {n.title}
                        </strong>
                        {!n.is_read && (
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#C49746' }} />
                        )}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#5B6578', margin: '0.2rem 0 0', lineHeight: 1.45 }}>
                        {n.message}
                      </p>
                      <span style={{ fontSize: '0.6875rem', color: '#A0AEC0', display: 'block', marginTop: '0.35rem' }}>
                        {new Date(n.created_at).toLocaleDateString()} &bull; {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '0.75rem 1.25rem',
                background: '#FAF7F2',
                borderTop: '1px solid rgba(0,0,0,0.06)',
                textAlign: 'center',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/student/notifications');
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0F172A',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                View Notifications & Messages History <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      <div
        className="flex items-center gap-3"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(user?.role === 'admin' ? '/admin/settings' : '/student/profile')}
        title="View Profile"
      >
        <div className="topbar-user-info text-right">
          <p className="text-sm font-semibold leading-tight" style={{ color: '#161D2B' }}>{user?.name}</p>
          <p className="text-xs" style={{ color: '#64748B', marginTop: '2px', fontWeight: 500 }}>
            {user?.role === 'admin' ? 'Consultancy Admin' : 'Student Account'}
          </p>
        </div>
        <Avatar name={user?.name || 'User'} src={avatarUrl} size="md" />
      </div>
    </header>
  );
}

export default Topbar;
