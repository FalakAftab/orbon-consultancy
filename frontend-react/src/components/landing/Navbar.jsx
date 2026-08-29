import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const links = [
  { label: 'Universities', href: '/universities' },
  { label: 'Programs', href: '/programs' },
  { label: 'Pathways', href: '#how-it-works' },
  { label: 'About Us', href: '#recommendations' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: scrolled ? 'rgba(250, 247, 242, 0.95)' : '#FAF7F2',
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
          {links.map((link) => (
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
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="lp-desktop-actions" style={{ alignItems: 'center', gap: '1.25rem' }}>
          <Link
            to="/login"
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#161D2B',
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>
          <Link
            to="/wizard"
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
            background: '#FAF7F2',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '1.25rem 1.5rem 1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {links.map((link) => (
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
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
            <Link
              to="/login"
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
              Sign In
            </Link>
            <Link
              to="/wizard"
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
