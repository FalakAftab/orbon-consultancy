import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  MessageSquare,
  FileText,
  CreditCard,
  Info,
  CheckCheck,
  Search,
  Filter,
  ArrowRight,
  Clock,
} from 'lucide-react';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../../api/notifications';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data || []);
    } catch (err) {
      console.error('Error fetching notification history:', err);
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
    if (notif.link) {
      navigate(notif.link);
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

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem 0' }}>
      
      {/* Header */}
      <div className="notifications-header">
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, color: '#161D2B', margin: 0 }}>
            Notifications & Messages History
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#5B6578', marginTop: '0.35rem' }}>
            Complete history of all advisor messages, application status updates, and system alerts.
          </p>
        </div>

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
          }}
        >
          <CheckCheck size={16} />
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="notifications-filter-bar">
        <div className="notifications-filter-pills">
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'messages', label: 'Advisor Messages' },
            { id: 'applications', label: 'Application Status' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              style={{
                background: filterType === tab.id ? '#161D2B' : '#FAF7F2',
                color: filterType === tab.id ? '#FFFFFF' : '#4A5568',
                border: filterType === tab.id ? 'none' : '1px solid rgba(0,0,0,0.06)',
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.825rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                whiteSpace: 'nowrap',
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
            placeholder="Search history..."
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

      {/* Notifications List Card */}
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
            {filteredNotifs.map((notif, idx) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4 style={{ fontSize: '0.975rem', fontWeight: notif.is_read ? 600 : 700, color: '#161D2B', margin: 0 }}>
                      {notif.title}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={13} />
                      {new Date(notif.created_at).toLocaleDateString()} {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#4A5568', margin: '0.35rem 0 0', lineHeight: 1.55 }}>
                    {notif.message}
                  </p>

                  {notif.link && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#C49746', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span>View details</span>
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
