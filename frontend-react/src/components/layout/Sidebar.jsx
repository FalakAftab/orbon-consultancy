import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Brand } from './Brand';
import { useAuth } from '../../contexts/AuthContext';

export function Sidebar({ nav, onNavigate, isOpen }) {
  const { signOut } = useAuth();

  const sections = nav.reduce((acc, item) => {
    const section = item.section || 'Main';
    if (!acc[section]) acc[section] = [];
    const entries = Array.isArray(item.items) ? item.items : [item];
    acc[section].push(...entries);
    return acc;
  }, {});

  return (
    <aside className={cn('sidebar', isOpen && 'sidebar-open')}>
      <Brand />
      <nav className="sidebar-nav" aria-label="Main navigation" style={{ padding: '0.5rem 1rem' }}>
        {Object.entries(sections).map(([section, items]) => (
          <div key={section} style={{ marginBottom: '1.25rem' }}>
            <div
              style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: '#8C96A8',
                textTransform: 'uppercase',
                padding: '0.5rem 0.75rem 0.35rem',
              }}
            >
              {section}
            </div>
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? '#0F172A' : '#4A5568',
                  background: isActive ? 'rgba(15, 23, 42, 0.06)' : 'transparent',
                  borderLeft: isActive ? '3px solid #C49746' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all 150ms ease',
                  marginBottom: '0.2rem',
                })}
              >
                <item.icon size={18} style={{ flexShrink: 0 }} />
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
                  {item.label}
                  {item.badge && (
                    <span
                      style={{
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #C49746 0%, #B45309 100%)',
                        color: '#FFFFFF',
                        letterSpacing: '0.05em',
                        boxShadow: '0 2px 6px rgba(196, 151, 70, 0.3)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #FAF7F2 0%, #EDE8DF 100%)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            border: '1px solid rgba(0,0,0,0.06)',
            marginBottom: '1rem',
          }}
        >
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.05em', color: '#718096', textTransform: 'uppercase' }}>
            GERMAN ADMISSION COMPASS
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#161D2B', marginTop: '0.35rem' }}>
            <span style={{ display: 'inline-flex', flexDirection: 'column', width: '16px', height: '12px', borderRadius: '2px', overflow: 'hidden' }}>
              <span style={{ background: '#000000', height: '4px' }} />
              <span style={{ background: '#DD0000', height: '4px' }} />
              <span style={{ background: '#FFCE00', height: '4px' }} />
            </span>
            Winter Semester 2026
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onNavigate?.();
            signOut();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '0.6rem',
            borderRadius: '8px',
            background: 'transparent',
            border: '1px solid rgba(0,0,0,0.08)',
            color: '#718096',
            fontSize: '0.825rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

