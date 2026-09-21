import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Programs', href: '/programs' },
  { label: 'Universities', href: '/universities' },
  { label: 'About', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Check My Eligibility', href: '/check-eligibility' },
];

export function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const authPath = user
    ? (user.role === 'admin' ? '/admin' : '/student')
    : '/login';

  const authLabel = user ? 'Dashboard' : 'Sign In';

  return (
    <header
      className={`lp-navbar ${scrolled ? 'lp-navbar-scrolled' : ''}`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: mobileOpen ? 1100 : 100,
        background: '#ffffff',
        borderBottom: '1px solid ' + (scrolled ? 'var(--lp-border)' : 'transparent'),
        transition: 'all 200ms ease',
      }}
    >
      <div
        className="lp-navbar-inner"
        style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: scrolled ? '0.8rem 2rem' : '1.25rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 200ms ease',
        }}
      >
        {/* Brand Logo */}
        <Link to="/" className="lp-mobile-brand" style={{ textDecoration: 'none', zIndex: 110 }}>
          <span style={{ 
            fontFamily: 'Playfair Display, Georgia, serif', 
            fontSize: '1.45rem', 
            fontWeight: 700, 
            color: 'var(--lp-foreground)', 
            letterSpacing: '-0.01em' 
          }}>
            Orbon Consultancy
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="lp-desktop-nav" style={{ 
          display: 'none', 
          alignItems: 'center', 
          gap: '2rem',
          '@media (min-width: 1024px)': { display: 'flex' }
        }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="lp-nav-link"
              style={{
                fontSize: '0.9rem',
                fontWeight: 500,
                color: 'var(--lp-foreground)',
                display: 'flex',
                alignItems: 'center',
                padding: '0.5rem 0'
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', zIndex: 110 }}>
          <div style={{ display: 'none', '@media (min-width: 1024px)': { display: 'flex', alignItems: 'center', gap: '1.25rem' } }} className="lp-desktop-actions">
            {!user && (
              <Link
                to="/register"
                className="lp-auth-button lp-register-button"
              >
                Register
              </Link>
            )}
            <Link
              to={authPath}
              className="lp-auth-button lp-signin-button"
            >
              {user ? authLabel : 'Sign In'}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lp-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--lp-foreground)',
              cursor: 'pointer',
              padding: '0.4rem',
            }}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            role="presentation"
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(14, 27, 46, 0.28)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              zIndex: 999,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: '#0e1b2e',
              color: '#c7a45b',
              borderBottom: '1px solid #243653',
              padding: '0',
              maxHeight: 'calc(100vh - 64px)',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 1000,
              boxShadow: '0 12px 24px rgba(14, 27, 46, 0.12)'
            }}
          >
          <div style={{ padding: '1rem 1.5rem' }}>
            {NAV_ITEMS.map(item => (
              <div key={item.label} style={{ borderBottom: '1px solid #243653' }}>
                <Link
                  to={item.href}
                  style={{
                    display: 'block',
                    padding: '1rem 0',
                    fontSize: '1.05rem',
                    fontWeight: 600,
                    color: '#c7a45b'
                  }}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
          
          <div style={{ padding: '1.5rem', background: '#0b1528', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!user && (
              <Link
                to="/register"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '0.875rem',
                  color: '#ffffff',
                  background: '#c7a45b',
                  border: '1px solid #c7a45b',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  transition: 'background-color 0.2s ease, color 0.2s ease'
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = '#ffffff';
                  event.currentTarget.style.color = '#0e1b2e';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = '#c7a45b';
                  event.currentTarget.style.color = '#ffffff';
                }}
              >
                Register
              </Link>
            )}
            <Link
              to={authPath}
              style={{
                width: '100%',
                textAlign: 'center',
                padding: '0.875rem',
                color: '#ffffff',
                background: '#c7a45b',
                border: '1px solid #c7a45b',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'background-color 0.2s ease, color 0.2s ease'
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = '#ffffff';
                event.currentTarget.style.color = '#0e1b2e';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = '#c7a45b';
                event.currentTarget.style.color = '#ffffff';
              }}
            >
              {user ? authLabel : 'Sign In'}
            </Link>
          </div>
          </div>
        </>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .lp-mobile-toggle { display: none !important; }
          .lp-desktop-nav { display: flex !important; }
          .lp-desktop-actions { display: flex !important; }
        }
      `}} />
    </header>
  );
}
