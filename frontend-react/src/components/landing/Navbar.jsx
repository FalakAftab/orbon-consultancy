import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getStartedPath = user
    ? (user.role === 'admin' ? '/admin' : '/student/wizard')
    : '/register';

  const universitiesPath = user
    ? (user.role === 'admin' ? '/admin/universities' : '/student/universities')
    : '#universities';

  const programsPath = user
    ? (user.role === 'admin' ? '/admin/programs' : '/student/programs')
    : '#how-it-works';

  const authPath = user
    ? (user.role === 'admin' ? '/admin' : '/student')
    : '/login';

  const authLabel = user ? 'Dashboard' : 'Sign In';

  const navLinks = [
    { label: 'Universities', href: universitiesPath, isRouter: Boolean(user) },
    { label: 'Programs', href: programsPath, isRouter: Boolean(user) },
    { label: 'About', href: '/about', isRouter: true },
    { label: 'Contact', href: '/contact', isRouter: true },
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#FFFFFF',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        transition: 'all 200ms ease',
      }}
    >
      <div
        className="lp-navbar-container"
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '1.1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Brand Logo - Pure Serif Text */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.45rem', fontWeight: 700, color: '#161D2B', letterSpacing: '-0.01em' }}>
            Orbon Consultancy
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="lp-desktop-nav" style={{ alignItems: 'center', gap: '2.25rem' }}>
          {navLinks.map((link) =>
            link.isRouter ? (
              <Link
                key={link.label}
                to={link.href}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#4A5568',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                style={{
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: '#4A5568',
                  textDecoration: 'none',
                  transition: 'color 150ms ease',
                }}
              >
                {link.label}
              </a>
            )
          )}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="lp-desktop-actions" style={{ alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to={authPath}
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#161D2B',
              textDecoration: 'none',
            }}
          >
            {authLabel}
          </Link>
          <Link
            to={getStartedPath}
            style={{
              background: '#161D2B',
              color: '#ffffff',
              padding: '0.6rem 1.35rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
              transition: 'background 150ms ease',
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          type="button"
          className="lp-mobile-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#161D2B',
            cursor: 'pointer',
            padding: '0.4rem',
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div
          className="lp-mobile-menu"
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '1.25rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map((link) =>
              link.isRouter ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#161D2B',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: '#161D2B',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </a>
              )
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Link
              to={authPath}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: 500,
                color: '#161D2B',
                textDecoration: 'none',
                textAlign: 'center',
                padding: '0.6rem',
                border: '1px solid rgba(0,0,0,0.15)',
                borderRadius: '6px',
              }}
            >
              {authLabel}
            </Link>
            <Link
              to={getStartedPath}
              onClick={() => setMobileOpen(false)}
              style={{
                background: '#161D2B',
                color: '#ffffff',
                padding: '0.75rem',
                borderRadius: '6px',
                fontWeight: 600,
                fontSize: '0.95rem',
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
