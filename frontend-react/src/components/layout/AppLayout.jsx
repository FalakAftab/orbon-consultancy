import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  History,
  BookmarkCheck,
  GraduationCap,
  Building2,
  Search,
  Users,
  FileSpreadsheet,
  Settings,
  User,
  BarChart3,
  Send,
  BadgeCheck,
  Bell,
} from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAuth } from '../../contexts/AuthContext';

const studentNav = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', to: '/student', end: true, icon: LayoutDashboard },
      { label: 'Apply for Me', to: '/student/apply-for-me', icon: Send, badge: 'PRO' },
    ],
  },
  {
    section: 'Discover',
    items: [
      { label: 'Recommendation Wizard', to: '/student/wizard', icon: Sparkles },
      { label: 'Results', to: '/student/results', icon: Search },
      { label: 'Programs', to: '/student/programs', icon: GraduationCap },
      { label: 'Universities', to: '/student/universities', icon: Building2 },
    ],
  },
  {
    section: 'My Activity',
    items: [
      { label: 'Shortlist', to: '/student/shortlist', icon: BookmarkCheck },
      { label: 'Notifications & History', to: '/student/notifications', icon: Bell },
      { label: 'History', to: '/student/history', icon: History },
      { label: 'Profile', to: '/student/profile', icon: User },
    ],
  },
];

const adminNav = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', to: '/admin', end: true, icon: LayoutDashboard }],
  },
  {
    section: 'Management',
    items: [
      { label: 'Premium Requests', to: '/admin/premium-applications', icon: BadgeCheck },
      { label: 'Universities', to: '/admin/universities', icon: Building2 },
      { label: 'Programs', to: '/admin/programs', icon: GraduationCap },
      { label: 'Students', to: '/admin/students', icon: Users },
      { label: 'Excel Import', to: '/admin/imports', icon: FileSpreadsheet },
    ],
  },
  {
    section: 'System',
    items: [
      { label: 'Analytics', to: '/admin/analytics', icon: BarChart3 },
      { label: 'Settings', to: '/admin/settings', icon: Settings },
    ],
  },
];

export function AppLayout({ role = 'student' }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 1024;
    }
    return true;
  });
  const { user } = useAuth();

  const effectiveRole = user?.role === 'admin' ? 'admin' : 'student';
  const effectiveNav = effectiveRole === 'admin' ? adminNav : studentNav;

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`app-shell ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed-mode'}`}>
      <Sidebar nav={effectiveNav} isOpen={sidebarOpen} onNavigate={() => {}} />
      <div className="app-main" style={{ transition: 'margin 200ms ease, width 200ms ease' }}>
        <Topbar onMenuClick={toggleSidebar} />
        <main className="app-content">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
