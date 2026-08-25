import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const links = [
  { label: 'Universities', href: '/universities' },
  { label: 'Programs', href: '/programs' },
  { label: 'Pathways', href: '#how-it-works' },
  { label: 'About Us', href: '#recommendations' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

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
        style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '1.1rem 2rem',
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

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.25rem' }}>
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
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
      </div>
    </header>
  );
}
