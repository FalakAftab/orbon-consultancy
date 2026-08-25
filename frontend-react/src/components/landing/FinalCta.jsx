import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export function FinalCta() {
  return (
    <section id="get-started" style={{ background: '#F7F5EF', padding: '5rem 0 6rem', textAlign: 'center' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '0 2rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#D4A93A', textTransform: 'uppercase' }}>
          GET STARTED TODAY
        </span>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 400, color: 'var(--color-charcoal)', marginTop: '0.5rem', lineHeight: 1.15 }}>
          Your German University Journey Starts Here.
        </h2>
        <p style={{ color: 'var(--color-muted)', fontSize: '1rem', marginTop: '1rem', lineHeight: 1.6 }}>
          Calculate your Bavarian Formula score for free or let our education consultancy team manage your entire application process.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2.25rem', flexWrap: 'wrap' }}>
          <Link
            to="/register"
            style={{
              background: '#0B3B36',
              color: '#ffffff',
              padding: '0.85rem 1.65rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 8px 24px -6px rgba(11,59,54,0.3)',
            }}
          >
            Find My Recommendations <ArrowRight size={16} />
          </Link>

          <Link
            to="/register?plan=premium"
            style={{
              background: '#FFF7E6',
              color: '#854D0E',
              border: '1px solid #D4A93A',
              padding: '0.85rem 1.65rem',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <Sparkles size={16} style={{ color: '#D4A93A' }} /> Get Premium Assistance
          </Link>
        </div>
      </div>
    </section>
  );
}
